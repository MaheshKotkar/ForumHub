import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forumdb');
        console.log('📡 Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });

        if (existingAdmin) {
            console.log('✅ Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            mongoose.disconnect();
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin
        const admin = await Admin.create({
            email: 'admin@example.com',
            password: hashedPassword
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
