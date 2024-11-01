CREATE DATABASE volunteerdb;
USE volunteerdb;

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
    FOREIGN KEY (email) REFERENCES UserCredentials(email)
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

-- will not execute in schema 10/30
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

INSERT INTO states (state_code, state_name) VALUES 
('AL', 'Alabama'),
('AK', 'Alaska'),
('AZ', 'Arizona'),
('AR', 'Arkansas'),
('CA', 'California'),
('CO', 'Colorado'),
('CT', 'Connecticut'),
('DE', 'Delaware'),
('FL', 'Florida'),
('GA', 'Georgia'),
('HI', 'Hawaii'),
('ID', 'Idaho'),
('IL', 'Illinois'),
('IN', 'Indiana'),
('IA', 'Iowa'),
('KS', 'Kansas'),
('KY', 'Kentucky'),
('LA', 'Louisiana'),
('ME', 'Maine'),
('MD', 'Maryland'),
('MA', 'Massachusetts'),
('MI', 'Michigan'),
('MN', 'Minnesota'),
('MS', 'Mississippi'),
('MO', 'Missouri'),
('MT', 'Montana'),
('NE', 'Nebraska'),
('NV', 'Nevada'),
('NH', 'New Hampshire'),
('NJ', 'New Jersey'),
('NM', 'New Mexico'),
('NY', 'New York'),
('NC', 'North Carolina'),
('ND', 'North Dakota'),
('OH', 'Ohio'),
('OK', 'Oklahoma'),
('OR', 'Oregon'),
('PA', 'Pennsylvania'),
('RI', 'Rhode Island'),
('SC', 'South Carolina'),
('SD', 'South Dakota'),
('TN', 'Tennessee'),
('TX', 'Texas'),
('UT', 'Utah'),
('VT', 'Vermont'),
('VA', 'Virginia'),
('WA', 'Washington'),
('WV', 'West Virginia'),
('WI', 'Wisconsin'),
('WY', 'Wyoming');

INSERT INTO UserCredentials (email, password_hash) VALUES 
('arenaud@uh.edu', 'arenaud'),
('aalmasri@uh.edu', 'aalmasri'),
('bdiaz@uh.edu', 'bdiazzz'),
('wlamberth@uh.edu', 'wlamberth'),
('admin@example.edu', 'adminPass123'),
('volunteer@example.com', 'volunteer2024');

INSERT INTO UserCredentials (email, password_hash) VALUES 
('ewilson@gmail.com', 'securePassword'),
('lbrown@gmail.com', 'securePassword'),
('omartinez@gmail.com', 'securePassword'),
('ntaylor@gmail.com', 'securePassword'),
('aanderson@gmail.com', 'securePassword'),
('ethomas@gmail.com', 'securePassword');

INSERT INTO UserProfile (email, full_name, address1, address2, city, state_code, zip_code, skills, preferences, availability) VALUES 
('arenaud@uh.edu', 'Arianne Renaud', '12345 Main St', 'Apt 4B', 'Houston', 'TX', '77001', '["Communication", "Leadership"]', '"Remote work"', '["2024-10-08", "2024-10-12"]'),
('aalmasri@uh.edu', 'Andrew Almasri', '456 Oak Ave', '', 'Dallas', 'TX', '75201', '["Technical Writing", "Project Management"]', '"In-office work"', '["2024-09-20", "2024-10-15"]'),
('bdiaz@uh.edu', 'Brendan Diaz', '789 Elm St', 'Suite 5', 'Miami', 'FL', '33101', '["Teamwork", "Leadership"]', '"Hybrid work"', '["2024-10-05", "2024-10-22"]'),
('wlamberth@uh.edu', 'Wyatt Lamberth', '101 Pine Dr', 'Apt 8A', 'New York', 'NY', '10001', '["Communication", "Teamwork"]', '"Remote work"', '["2024-10-01", "2024-10-18"]'),
('ewilson@gmail.com', 'Emma Wilson', '202 Cedar Ln', 'Unit 3C', 'Los Angeles', 'CA', '90001', '["Project Management", "Leadership"]', '"In-office work"', '["2024-09-25", "2024-10-15"]'),
('lbrown@gmail.com', 'Liam Brown', '303 Birch St', '', 'Chicago', 'IL', '60601', '["Technical Writing", "Leadership"]', '"Hybrid work"', '["2024-10-02", "2024-10-12"]'),
('omartinez@gmail.com', 'Olivia Martinez', '404 Maple Ave', 'Floor 2', 'San Francisco', 'CA', '94101', '["Communication", "Teamwork"]', '"Remote work"', '["2024-10-06", "2024-10-20"]'),
('ntaylor@gmail.com', 'Noah Taylor', '505 Cherry St', '', 'Phoenix', 'AZ', '85001', '["Leadership", "Project Management"]', '"In-office work"', '["2024-10-10", "2024-10-18"]'),
('aanderson@gmail.com', 'Ava Anderson', '606 Walnut Rd', 'Apt 12C', 'Denver', 'CO', '80201', '["Teamwork", "Technical Writing"]', '"Remote work"', '["2024-10-03", "2024-10-22"]'),
('ethomas@gmail.com', 'Ethan Thomas', '707 Spruce Blvd', '', 'Seattle', 'WA', '98101', '["Communication", "Project Management"]', '"Hybrid work"', '["2024-10-05", "2024-10-14"]'),
('admin@example.edu', 'Admin User', '123 Admin St', '', 'Admin City', 'AC', '12345', '["Administration", "Leadership"]', '"Remote work"', '["2024-10-15", "2024-10-25"]'),
('volunteer@example.com', 'Volunteer User', '789 Volunteer Rd', '', 'Volunteer City', 'VC', '67890', '["Volunteering", "Teamwork"]', '"On-site work"', '["2024-10-10", "2024-10-20"]');






