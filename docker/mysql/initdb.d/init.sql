DROP DATABASE IF EXISTS chater;
CREATE DATABASE chater;
use chater;
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT,
    email VARCHAR (255),
    password VARCHAR (255),
    created_at DATETIME,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR (255) PRIMARY KEY,
    name TEXT,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS accessable_rooms (
    user_id VARCHAR (255),
    room_id VARCHAR (255),
    created_at DATETIME,
    deleted_at DATETIME,
    PRIMARY KEY (user_id,room_id)
);


DROP DATABASE IF EXISTS chater_test;
CREATE DATABASE chater_test;
use chater_test;
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT,
    email VARCHAR (255),
    password VARCHAR (255),
    created_at DATETIME,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR (255) PRIMARY KEY,
    name TEXT,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS accessable_rooms (
    user_id VARCHAR (255),
    room_id VARCHAR (255),
    created_at DATETIME,
    deleted_at DATETIME,
    PRIMARY KEY (user_id,room_id)
);