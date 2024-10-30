CREATE DATABASE volunteerdb;

CREATE TABLE UserCredentials ( -- auth.mjs
    email VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,  -- Store the encrypted password here
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE UserProfile ( 
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    city VARCHAR(100),
    state_code CHAR(2),  -- Links to States table
    zip_code VARCHAR(20),
    skills JSON,         -- List or JSON of skills
    preferences JSON,
    availability JSON,    -- Availability can be stored as JSON or delimited text
    PRIMARY KEY (email),
    FOREIGN KEY (email) REFERENCES UserCredentials(email) ON DELETE CASCADE
);

CREATE TABLE EventDetails ( -- events.mjs
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    state_code CHAR(2),
    city VARCHAR(100),
    location VARCHAR(255),
    required_skills JSON,  -- List or JSON of required skills
    urgency ENUM('Low', 'Medium', 'High'),
    event_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_code) REFERENCES States(state_code)  -- Link to States table
);

CREATE TABLE VolunteerHistory (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_description VARCHAR(500) NOT NULL,
    location VARCHAR(255) NOT NULL,
    required_skills JSON NOT NULL,
    urgency ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    event_date DATE NOT NULL,
    participation_status ENUM('Completed', 'Pending', 'Cancelled') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES UserCredentials(user_id)
);


CREATE TABLE States (
    state_code CHAR(2) PRIMARY KEY,
    state_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL, -- Added email for user reference
    type ENUM('Event Assignment', 'Reminder', 'Update') NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES UserCredentials(email) ON DELETE CASCADE
);

DELIMITER //
CREATE TRIGGER SendReminderNotification
AFTER UPDATE ON Events
FOR EACH ROW
BEGIN
    DECLARE timeDifference INT;
    SET timeDifference = TIMESTAMPDIFF(HOUR, NOW(), NEW.date);

    IF timeDifference = 24 THEN
        INSERT INTO Notifications (user_id, type, message)
        SELECT user_id, 'Reminder', CONCAT('Reminder: The event "', NEW.title, '" is coming up in 24 hours!')
        FROM UserCredentials;
    END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER SendUpdateNotification
AFTER UPDATE ON Events
FOR EACH ROW
BEGIN
    IF NEW.is_updated = TRUE THEN
        INSERT INTO Notifications (user_id, type, message)
        SELECT user_id, 'Update', CONCAT('The event "', NEW.title, '" has been updated. Please check the latest details.')
        FROM UserCredentials;

        -- Reset the `is_updated` flag after notifying
        SET NEW.is_updated = FALSE;
    END IF;
END;
//
DELIMITER ;