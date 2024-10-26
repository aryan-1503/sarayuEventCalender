-- Create the database
CREATE DATABASE eventCalendar;

-- Switch to the new database
\c eventCalendar;

-- Create the user table
CREATE TABLE users (
   userId SERIAL PRIMARY KEY,
   username VARCHAR(50) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL,
   verificationCode VARCHAR(10),
   isVerified BOOLEAN DEFAULT FALSE,
   attempts INT DEFAULT 0
);

-- Create the event table
CREATE TABLE events (
    eventId SERIAL PRIMARY KEY,
    eventName VARCHAR(100) NOT NULL,
    description TEXT,
    eventDate TIMESTAMP NOT NULL,
    shouldRemind BOOLEAN DEFAULT FALSE,
    userId INT REFERENCES users(userId) ON DELETE CASCADE
);
