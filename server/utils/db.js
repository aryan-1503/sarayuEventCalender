import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Connect to the existing database
const poolWithDb = new Pool({
    connectionString: process.env.DATABASE_URL,  // Ensure this is correct
});

const createTables = async () => {
    try {
        await poolWithDb.connect(); // Test the connection
        console.log("Connected to the database.");

        // Now create tables
        await poolWithDb.query(`
          CREATE TABLE IF NOT EXISTS users (
            userId SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            verificationCode VARCHAR(10),
            isVerified BOOLEAN DEFAULT FALSE,
            attempts INT DEFAULT 0
          );
        `);

        await poolWithDb.query(`
          CREATE TABLE IF NOT EXISTS events (
            eventId SERIAL PRIMARY KEY,
            eventName VARCHAR(100) NOT NULL,
            description TEXT,
            eventDate TIMESTAMP NOT NULL,
            shouldRemind BOOLEAN DEFAULT FALSE,
            userId INT REFERENCES users(userId) ON DELETE CASCADE
          );
        `);

        console.log("Tables created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};

export { poolWithDb, createTables };
