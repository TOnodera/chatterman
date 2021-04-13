CREATE DATABASE IF NOT EXISTS chatter;
use chatter;
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    email VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    created_at DATETIME NOT NULL,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR (255) PRIMARY KEY,
    name TEXT NOT NULL,
    creater_id VARCHAR(255) NOT NULL,
    room_type VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS accessable_rooms (
    user_id VARCHAR (255),
    room_id VARCHAR (255),
    created_at DATETIME NOT NULL,
    deleted_at DATETIME,
    PRIMARY KEY (user_id,room_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR (255) NOT NULL,
    room_id VARCHAR (255) NOT NULL,
    message TEXT,
    created_at DATETIME NOT NULL,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    target_user VARCHAR (255) NOT NULL,
    request_user VARCHAR (255) NOT NULL,
    is_accept TINYINT NOT NULL,
    accept_notified TINYINT NOT NULL,
    created_at DATETIME NOT NULL,
    deleted_at DATETIME,
    UNIQUE (target_user,request_user)
);

CREATE TABLE IF NOT EXISTS message_polymorphics(
    unique_id INT AUTO_INCREMENT PRIMARY KEY,
    message_id VARCHAR(255) NOT NULL,
    polymorphic_id VARCHAR(255) NOT NULL,
    polymorphic_table VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE (message_id),
    UNIQUE (polymorphic_table,polymorphic_id)
);