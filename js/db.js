// Database using Supabase
const DB = {
    async init() {
        console.log('Initializing Supabase database...');
        // Check if tables exist and seed initial data if needed
        await this.seedInitialData();
    },

    async seedInitialData() {
        try {
            // Check if admin user exists
            const { data: existingAdmin } = await supabase
                .from('users')
                .select('*')
                .eq('email', 'admin@himalayan.com')
                .single();

            if (!existingAdmin) {
                console.log('Seeding initial data...');

                // Create admin user
                const { data: adminUser, error: adminError } = await supabase
                    .from('users')
                    .insert([{
                        full_name: 'Admin User',
                        email: 'admin@himalayan.com',
                        phone: '9999999999',
                        role: 'Admin',
                        password: this.hashPassword('admin1234'),
                        aadhaar_encrypted: this.encrypt('123456789012'),
                        aadhaar_last4: '9012',
                        trek_count: 0
                    }])
                    .select()
                    .single();

                if (adminError) {
                    console.error('Error creating admin:', adminError);
                } else {
                    console.log('Admin user created');
                }

                // Create guide user
                const { data: guideUser, error: guideError } = await supabase
                    .from('users')
                    .insert([{
                        full_name: 'Sherpa Tenzing',
                        email: 'guide@himalayan.com',
                        phone: '8888888888',
                        role: 'Trek Guide',
                        password: this.hashPassword('guide123'),
                        aadhaar_encrypted: this.encrypt('123456789012'),
                        aadhaar_last4: '9012',
                        trek_count: 100
                    }])
                    .select()
                    .single();

                if (guideError) {
                    console.error('Error creating guide:', guideError);
                } else {
                    console.log('Guide user created');

                    // Create sample trek
                    if (guideUser) {
                        const { error: trekError } = await supabase
                            .from('treks')
                            .insert([{
                                location: 'Everest Base Camp',
                                date: '2025-05-01',
                                guide_id: guideUser.id,
                                amount: 9000,
                                description: 'Spectacular trek to the base of Mount Everest',
                                difficulty: 'hard',
                                max_participants: 15,
                                status: 'upcoming'
                            }]);

                        if (trekError) {
                            console.error('Error creating trek:', trekError);
                        } else {
                            console.log('Sample trek created');
                        }
                    }
                }
            } else {
                console.log('Database already initialized');
            }
        } catch (error) {
            console.error('Error seeding data:', error);
        }
    },

    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    hashPassword(password) {
        // Simple hash for demo - in production use proper hashing
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    },

    encrypt(text) {
        // Simple encryption for demo - in production use proper encryption
        return btoa(text);
    },

    decrypt(encrypted) {
        return atob(encrypted);
    },

    async getCollection(name) {
        const { data, error } = await supabase
            .from(name)
            .select('*');

        if (error) {
            console.error(`Error fetching ${name}:`, error);
            return [];
        }
        return data || [];
    },

    async add(collection, item) {
        const { data, error } = await supabase
            .from(collection)
            .insert([item])
            .select()
            .single();

        if (error) {
            console.error(`Error adding to ${collection}:`, error);
            throw error;
        }
        return data;
    },

    async update(collection, id, updates) {
        const { data, error } = await supabase
            .from(collection)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Error updating ${collection}:`, error);
            return null;
        }
        return data;
    },

    async findOne(collection, query) {
        let queryBuilder = supabase.from(collection).select('*');

        // Apply query filters
        Object.keys(query).forEach(key => {
            queryBuilder = queryBuilder.eq(key, query[key]);
        });

        const { data, error } = await queryBuilder.single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error(`Error finding in ${collection}:`, error);
        }
        return data || null;
    },

    async find(collection, query) {
        let queryBuilder = supabase.from(collection).select('*');

        // Apply query filters if provided
        if (query) {
            Object.keys(query).forEach(key => {
                queryBuilder = queryBuilder.eq(key, query[key]);
            });
        }

        const { data, error } = await queryBuilder;

        if (error) {
            console.error(`Error finding in ${collection}:`, error);
            return [];
        }
        return data || [];
    },

    // Helper to ensure DB is ready
    ensureReady: async function () {
        // Just return immediately - we'll handle initialization differently
        return Promise.resolve();
    }
};

// Initialize database when Supabase is ready
(async () => {
    try {
        // Wait a bit for Supabase client to be ready
        if (typeof supabase === 'undefined') {
            console.warn('Supabase client not loaded yet, waiting...');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        await DB.init();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
})();

