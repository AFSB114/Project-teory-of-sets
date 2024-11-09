CREATE DATABASE vennture;

USE vennture;

CREATE TABLE logs(
    id SERIAL NOT NULL,
    nickname VARCHAR(40) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_update DATE DEFAULT CURRENT_DATE NULL,
    token VARCHAR(100),
    PRIMARY KEY(id)
);

CREATE TABLE character(
    id SERIAL NOT NULL,
    profileurl VARCHAR(70),
    spritesurl VARCHAR(70),
    PRIMARY KEY(id)
);

CREATE TABLE users(
    id INT NOT NULL,
    name VARCHAR(40) NOT NULL,
    surname VARCHAR(40) NOT NULL,
    birthday DATE,
    date_create DATE,
    rol_id INT DEFAULT 2,
     character_id INT DEFAULT 1,
    PRIMARY KEY(id),
    FOREIGN KEY(character_id) REFERENCES character(id),
    FOREIGN KEY(id) REFERENCES log(id) ON DELETE CASCADE
);

CREATE TABLE rol(
    id SERIAL NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

ALTER TABLE users
ADD FOREIGN KEY(rol_id) REFERENCES rol(id);

CREATE TABLE room(
    id INT NOT NULL,
    max_time INT NOT NULL,
    nums_levels INT NOT NULL,
    status_id INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE status(
    id SERIAL NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

ALTER TABLE room
ADD FOREIGN KEY(status_id) REFERENCES status(id);

CREATE TABLE level(
    id SERIAL NOT NULL,
    name VARCHAR(50),
    description TEXT,
    difficulty_id INT NOT NULL,
    add_date DATE,
    PRIMARY KEY(id)
);

CREATE TABLE difficulty(
    id SERIAL NOT NULL,
    name VARCHAR(40) NOT NULL,
    PRIMARY KEY(id)
);

ALTER TABLE level
ADD FOREIGN KEY(difficulty_id) REFERENCES difficulty(id);

CREATE TABLE user_room(
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    rol_id INT NOT NULL,
    data VARCHAR(50) NOT NULL,
    PRIMARY KEY(user_id,room_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(room_id) REFERENCES room(id) ON DELETE CASCADE,
    FOREIGN KEY(rol_id) REFERENCES rol(id)
);

CREATE TABLE user_level(
    user_id INT NOT NULL,
    level_id INT NOT NULL,
    time INT NOT NULL,
    status_id INT NOT NULL,
    PRIMARY KEY(user_id,level_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(level_id) REFERENCES level(id) ON DELETE CASCADE,
    FOREIGN KEY(status_id) REFERENCES status(id)
);

