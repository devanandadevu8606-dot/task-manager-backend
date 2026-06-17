const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Task = require('../models/Task');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Ensure a seed user exists
    let seedUser = await User.findOne({ email: 'seeduser@example.com' });
    if (!seedUser) {
      console.log('Creating a seed user...');
      seedUser = await User.create({
        name: 'Seed User',
        email: 'seeduser@example.com',
        password: 'password123' // Will be automatically hashed by pre-save hook
      });
      console.log(`Seed user created: ${seedUser.email}`);
    } else {
      console.log(`Found existing seed user: ${seedUser.email}`);
    }

    // 3. Define 5 sample tasks linked to the seed user
    const sampleTasks = [
      {
        title: "Configure Database Connection",
        description: "Setup Mongoose connection to local MongoDB database and handle connection events.",
        status: "completed",
        priority: "high",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        createdBy: seedUser._id
      },
      {
        title: "Define Schemas & Models",
        description: "Create Mongoose schemas for User and Task with proper types and validation rules.",
        status: "completed",
        priority: "high",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        createdBy: seedUser._id
      },
      {
        title: "Implement CRUD Controllers",
        description: "Write Express controllers using async/await and try/catch for handling HTTP requests.",
        status: "pending",
        priority: "medium",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdBy: seedUser._id
      },
      {
        title: "Setup JWT Authentication",
        description: "Implement register/login endpoints, password hashing using bcrypt, and token generation.",
        status: "pending",
        priority: "high",
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        createdBy: seedUser._id
      },
      {
        title: "Polish and Refactor",
        description: "Filter tasks by logged-in user, implement input validation, and centralize error handling middleware.",
        status: "pending",
        priority: "low",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdBy: seedUser._id
      }
    ];

    // 4. Clear Existing Tasks belonging to the seed user (or all tasks for safety)
    console.log('Clearing existing tasks...');
    await Task.deleteMany();

    // 5. Insert Seed Tasks
    console.log('Inserting seed tasks...');
    const createdTasks = await Task.insertMany(sampleTasks);
    
    console.log(`Successfully seeded ${createdTasks.length} tasks linked to user "${seedUser.name}"!`);
    
    // 6. Close database connection
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
