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
    id INT AUTO_INCREMENT PRIMARY KEY,
    massage_id VARCHAR(255) NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL
);

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES ('77f6eb46-4907-4e7e-b93b-5135aaedc3b1', '管理システム', 'info@chat-system.com', 'god@father.com', '2021-03-25 01:24:21');
INSERT INTO `rooms` (`id`, `name`, `room_type`, `creater_id`, `created_at`) VALUES ('everybody', 'ミーティングルーム','talkroom' ,'77f6eb46-4907-4e7e-b93b-5135aaedc3b1', '2021-03-25 01:24:21');

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
    creater_id VARCHAR(255) NOT NULL,
    room_type VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    deleted_at DATETIME
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
    id INT AUTO_INCREMENT PRIMARY KEY,
    massage_id VARCHAR(255) NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL
);

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES ('77f6eb46-4907-4e7e-b93b-5135aaedc3b1', '管理システム', 'info@chat-system.com', 'god@father.com', '2021-03-25 01:24:21');
INSERT INTO `rooms` (`id`, `name`, `room_type`, `creater_id`, `created_at`) VALUES ('everybody', 'ミーティングルーム','talkroom' ,'77f6eb46-4907-4e7e-b93b-5135aaedc3b1', '2021-03-25 01:24:21');