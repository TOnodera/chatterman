DROP DATABASE IF EXISTS chater;
CREATE DATABASE chater;
use chater;
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
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS accessable_rooms (
    user_id VARCHAR (255),
    room_id VARCHAR (255),
    created_at DATETIME NOT NULL,
    deleted_at DATETIME,
    PRIMARY KEY (user_id,room_id)
);

CREATE TABLE IF NOT EXISTS messages (
    message_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR (255) NOT NULL,
    room_id VARCHAR (255) NOT NULL,
    message TEXT,
    created_at DATETIME NOT NULL,
    deleted_at DATETIME
);

INSERT INTO `rooms` (`id`, `name`, `created_at`) VALUES ('test-room', 'everybody', '2021-03-25 01:24:21');

/**
TEST DATABASE 
*/

DROP DATABASE IF EXISTS chater_test;
CREATE DATABASE chater_test;
use chater_test;
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
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS accessable_rooms (
    user_id VARCHAR (255),
    room_id VARCHAR (255),
    created_at DATETIME NOT NULL,
    deleted_at DATETIME NOT NULL,
    PRIMARY KEY (user_id,room_id)
);

CREATE TABLE IF NOT EXISTS messages (
    message_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR (255) NOT NULL,
    room_id VARCHAR (255) NOT NULL,
    message TEXT,
    created_at DATETIME NOT NULL,
    deleted_at DATETIME
);


INSERT INTO `rooms` (`id`, `name`, `created_at`) VALUES ('test-room', 'everybody', '2021-03-25 01:24:21');
