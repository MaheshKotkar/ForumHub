import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    try {
        console.log('🔍 Testing MongoDB connection...');
        console.log('📍 Connection URI:', process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ Successfully connected to MongoDB!');
        console.log('📊 Database:', mongoose.connection.db.databaseName);

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📁 Existing collections:');
        collections.forEach(col => console.log(`   - ${col.name}`));

        // Check if users collection exists
        const hasUsers = collections.some(col => col.name === 'users');
        if (hasUsers) {
            const userCount = await mongoose.connection.db.collection('users').countDocuments();
            console.log(`\n👥 Users collection found with ${userCount} document(s)`);
        } else {
            console.log('\nℹ️  Users collection will be created when first user is added');
        }

        console.log('\n✨ All collections will be auto-created by Mongoose when data is inserted');
        console.log('🎉 Database connection is working perfectly!');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
};

testConnection();
