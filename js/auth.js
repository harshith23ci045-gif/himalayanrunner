// Authentication utilities
const Auth = {
    async login(email, password) {
        try {
            console.log('Attempting login for:', email);
            const user = await DB.findOne('users', { email });

            if (!user) {
                console.log('User not found');
                return { success: false, error: 'Invalid credentials' };
            }

            const hashedPassword = DB.hashPassword(password);
            if (user.password !== hashedPassword) {
                console.log('Password mismatch');
                return { success: false, error: 'Invalid credentials' };
            }

            console.log('Login successful for user:', user);

            // Store session
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                role: user.role,
                fullName: user.full_name
            }));

            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    },

    async register(formData) {
        try {
            const existingUser = await DB.findOne('users', { email: formData.email });
            if (existingUser) {
                return { success: false, error: 'User already exists' };
            }

            const newUser = {
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                password: DB.hashPassword(formData.password),
                aadhaar_encrypted: DB.encrypt(formData.aadhaar),
                aadhaar_last4: formData.aadhaar.slice(-4),
                trek_count: 0
            };

            const createdUser = await DB.add('users', newUser);
            return { success: true, user: createdUser };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Failed to create user. Please try again.' };
        }
    },

    async getCurrentUser() {
        try {
            const sessionUser = sessionStorage.getItem('currentUser');
            if (!sessionUser) {
                console.log('No session found');
                return null;
            }

            const { id } = JSON.parse(sessionUser);
            console.log('Getting user from DB with id:', id);
            const user = await DB.findOne('users', { id });
            console.log('User from DB:', user);
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    },

    logout() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },

    async requireAuth() {
        try {
            console.log('Checking authentication...');
            const user = await this.getCurrentUser();
            if (!user) {
                console.log('No authenticated user, redirecting to login');
                window.location.href = 'login.html';
                return null;
            }
            console.log('User authenticated:', user);
            return user;
        } catch (error) {
            console.error('Auth check error:', error);
            window.location.href = 'login.html';
            return null;
        }
    },

    maskPhone(phone) {
        return phone.replace(/.(?=.{3})/g, '*');
    }
    ,

    // ----- Password reset (demo) -----
    // This implements an app-level reset flow for the static/demo site.
    // It stores short-lived reset tokens in localStorage and "sends" a
    // reset link to both email and SMS in a simulated way. Replace the
    // send functions with real email/SMS providers for production.

    async requestPasswordReset(identifier /* email or phone */) {
        try {
            // Try find by email first, then by phone
            let user = await DB.findOne('users', { email: identifier });
            if (!user) {
                user = await DB.findOne('users', { phone: identifier });
            }

            if (!user) {
                return { success: false, error: 'No account found for that email or phone.' };
            }

            // Allow for Trekker, Trek Guide, and Admin roles
            if (user.role !== 'Trekker' && user.role !== 'Trek Guide' && user.role !== 'Admin') {
                return { success: false, error: 'Password reset is available only for Trekker, Trek Guide, and Admin users.' };
            }

            // If Supabase client is available, prefer using Supabase Auth to send a secure reset email
            if (typeof supabase !== 'undefined' && supabase && supabase.auth) {
                try {
                    const origin = (location && location.origin && location.origin !== 'null') ? location.origin : 'http://localhost:53297';
                    // Use Supabase to send password reset email. Provide a redirect back to the local reset page.
                    const redirectTo = origin + '/reset-password.html';
                    const { data, error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo });
                    if (error) {
                        console.error('Supabase reset email error:', error);
                        // fall through to simulated fallback
                    } else {
                        // Supabase will handle sending the email; also simulate SMS send for demo
                        this._simulatedSendSms(user.phone, '(Reset email sent via Supabase)');
                        return { success: true, message: 'Password reset email sent to the registered email address. Check your inbox (or spam).', link: null, via: 'supabase' };
                    }
                } catch (err) {
                    console.error('Error calling Supabase reset:', err);
                    // continue to fallback
                }
            }

            // Fallback: client-side simulated token flow (demo only)
            const token = DB.generateId() + '_' + Math.random().toString(36).slice(2, 10);
            const expiresAt = Date.now() + (1000 * 60 * 30); // 30 minutes

            const store = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
            store.push({ token, userId: user.id, expiresAt });
            localStorage.setItem('passwordResetTokens', JSON.stringify(store));

            // Construct reset link (works locally and when served)
            const origin = location.origin === 'null' ? 'http://localhost:8000' : location.origin;
            const resetLink = origin.replace(/:\d+$/, ':8000') + '/reset-password.html?token=' + encodeURIComponent(token);

            // Simulated send to email and SMS. In demo we show the link in-console
            this._simulatedSendEmail(user.email, resetLink);
            this._simulatedSendSms(user.phone, resetLink);

            return { success: true, message: 'Reset link sent to email and mobile.' , link: resetLink };
        } catch (error) {
            console.error('Request reset error:', error);
            return { success: false, error: 'Failed to request password reset.' };
        }
    },

    async resetPasswordWithToken(token, newPassword) {
        try {
            const store = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
            const entry = store.find(s => s.token === token);
            if (!entry) {
                return { success: false, error: 'Invalid or expired token.' };
            }
            if (Date.now() > entry.expiresAt) {
                return { success: false, error: 'Token has expired.' };
            }

            const user = await DB.findOne('users', { id: entry.userId });
            if (!user) {
                return { success: false, error: 'User not found.' };
            }

            // Update password (hash with DB helper)
            const hashed = DB.hashPassword(newPassword);
            const updated = await DB.update('users', user.id, { password: hashed });

            // Remove used token
            const remaining = store.filter(s => s.token !== token);
            localStorage.setItem('passwordResetTokens', JSON.stringify(remaining));

            return { success: true, user: updated };
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: 'Failed to reset password.' };
        }
    },

    _simulatedSendEmail(email, link) {
        // Build email HTML using the template provided by the user
        const emailHtml = `
            <h2>Reset Password</h2>
            <p>Follow this link to reset the password for your user:</p>
            <p><a href="${link}">Reset Password</a></p>
        `;

        console.log(`Simulated email to ${email}:`);
        console.log(emailHtml);

        // Save last simulated email to localStorage for demo inspection
        try {
            localStorage.setItem('lastSimulatedResetEmail', JSON.stringify({ to: email, html: emailHtml, sentAt: Date.now() }));
        } catch (e) {
            // ignore storage errors
        }

        // For demo convenience also show in-page notification if available
        if (typeof showAppMessage === 'function') showAppMessage(`Email sent to ${email}`);
    },

    _simulatedSendSms(phone, link) {
        console.log(`Simulated SMS to ${phone}: Password reset link -> ${link}`);
        if (typeof showAppMessage === 'function') showAppMessage(`SMS sent to ${phone}`);
    }
};
