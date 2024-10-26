import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Connect without specifying a database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL_NO_DB,  // DATABASE_URL_NO_DB points to the default db (usually 'postgres')
});

export let poolWithDb
const createDatabaseAndTables = async () => {
    try {
        // Check if the database exists and create if it doesn’t
        // await pool.query(`CREATE DATABASE eventcalendar;`);
        console.log("Database 'eventcalendar' created.");

        // Connect to the newly created database
        poolWithDb = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

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
        // poolWithDb.end();
    } catch (error) {
        if (error.code === '42P04') {
            console.log("Database 'eventcalendar' already exists.");
        } else {
            console.error("Error creating database or tables:", error);
        }
    }
};

export default createDatabaseAndTables;
