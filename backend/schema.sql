-- Candor: Anonymous Q&A App — MySQL Schema
-- Run this once against your Aiven (or any) MySQL database before starting the backend.

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NOT NULL,
    content TEXT NOT NULL,
    is_replied BOOLEAN DEFAULT FALSE,
    is_reported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS replies (
    reply_id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    reply_content TEXT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE
);

-- Helpful indexes for the queries the app runs most often
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
