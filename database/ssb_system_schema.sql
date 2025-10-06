-- ssb_system_schema.sql
-- Database schema for Smart School Bus Tracking System (SSB 1.0)

CREATE DATABASE IF NOT EXISTS ssb_system;
USE ssb_system;

-- Table: bus
CREATE TABLE IF NOT EXISTS bus (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL,
    capacity INT DEFAULT 40,
    status ENUM('Active','Inactive','Maintenance') DEFAULT 'Active'
);

-- Table: driver
CREATE TABLE IF NOT EXISTS driver (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    license_number VARCHAR(30),
    assigned_bus INT,
    FOREIGN KEY (assigned_bus) REFERENCES bus(bus_id)
);

-- Table: parent
CREATE TABLE IF NOT EXISTS parent (
    parent_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    phone_number VARCHAR(15) UNIQUE,
    email VARCHAR(100),
    password_hash VARCHAR(255)
);

-- Table: student
CREATE TABLE IF NOT EXISTS student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    grade VARCHAR(10),
    parent_id INT,
    pickup_point VARCHAR(255),
    dropoff_point VARCHAR(255),
    FOREIGN KEY (parent_id) REFERENCES parent(parent_id)
);

-- Table: route
CREATE TABLE IF NOT EXISTS route (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100),
    start_point VARCHAR(255),
    end_point VARCHAR(255),
    estimated_time INT
);

-- Table: schedule
CREATE TABLE IF NOT EXISTS schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    driver_id INT,
    route_id INT,
    schedule_date DATE,
    departure_time TIME,
    arrival_time TIME,
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id),
    FOREIGN KEY (driver_id) REFERENCES driver(driver_id),
    FOREIGN KEY (route_id) REFERENCES route(route_id)
);

-- Table: bus_tracking
CREATE TABLE IF NOT EXISTS bus_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    latitude DOUBLE,
    longitude DOUBLE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id)
);

-- Table: notification
CREATE TABLE IF NOT EXISTS notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    message TEXT,
    type ENUM('Arrival','Delay','Emergency'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parent(parent_id)
);

-- Optional: sample indices for performance
CREATE INDEX idx_bus_status ON bus(status);
CREATE INDEX idx_schedule_date ON schedule(schedule_date);
CREATE INDEX idx_bus_tracking_time ON bus_tracking(timestamp);