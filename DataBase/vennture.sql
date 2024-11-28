CREATE DATABASE vennture;

USE vennture;

CREATE TABLE log(
    id SERIAL NOT NULL,
    nickname VARCHAR(40) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_update DATE DEFAULT CURRENT_DATE NULL,
    PRIMARY KEY(id)
);

CREATE TABLE character(
    id SERIAL NOT NULL,
    profileurl VARCHAR(70),
    spritesurl VARCHAR(70),
    PRIMARY KEY(id)
);

INSERT INTO character (profileurl, spritesurl) VALUES
('femaleCharacter/femaleCharacterProfile1.png', 'femaleCharacter/sprites/femaleCharacter1.png'),
('femaleCharacter/femaleCharacterProfile2.png', 'femaleCharacter/sprites/femaleCharacter2.png'),
('femaleCharacter/femaleCharacterProfile3.png', 'femaleCharacter/sprites/femaleCharacter3.png'),
('femaleCharacter/femaleCharacterProfile4.png', 'femaleCharacter/sprites/femaleCharacter4.png'),
('femaleCharacter/femaleCharacterProfile5.png', 'femaleCharacter/sprites/femaleCharacter5.png'),
('femaleCharacter/femaleCharacterProfile6.png', 'femaleCharacter/sprites/femaleCharacter6.png'),
('femaleCharacter/femaleCharacterProfile7.png', 'femaleCharacter/sprites/femaleCharacter7.png'),
('maleCharacter/maleCharacterProfile1.png', 'maleCharacter/sprites/maleCharacter1.png'),
('maleCharacter/maleCharacterProfile2.png', 'maleCharacter/sprites/maleCharacter2.png'),
('maleCharacter/maleCharacterProfile3.png', 'maleCharacter/sprites/maleCharacter3.png'),
('maleCharacter/maleCharacterProfile4.png', 'maleCharacter/sprites/maleCharacter4.png'),
('maleCharacter/maleCharacterProfile5.png', 'maleCharacter/sprites/maleCharacter5.png'),
('maleCharacter/maleCharacterProfile6.png', 'maleCharacter/sprites/maleCharacter6.png'),
('maleCharacter/maleCharacterProfile7.png', 'maleCharacter/sprites/maleCharacter7.png');

CREATE TABLE users(
    id INT NOT NULL,
    name VARCHAR(40) NOT NULL,
    surname VARCHAR(40) NOT NULL,
    birthday DATE,
    date_create DATE,
    see_int_mlt BOOLEAN DEFAULT FALSE,
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

INSERT INTO rol (name) VALUES ('admin'), ('user'), ('admin_room'), ('guest_room');

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
    add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
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

-- Primero cambiar el tipo
ALTER TABLE user_level
ALTER COLUMN time TYPE VARCHAR(5);

-- Luego agregar la restricción (opcional pero recomendado)
ALTER TABLE user_level
ADD CONSTRAINT check_formato_tiempo 
CHECK (time ~ '^[0-5][0-9]:[0-5][0-9]$');

ALTER TABLE user_level
ALTER COLUMN time DROP NOT NULL;

CREATE TABLE level_room(
    level_id integer not null  references level,
    room_id  integer not null  references room on delete cascade,
    primary key (level_id, room_id)
);