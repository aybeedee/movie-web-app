CREATE DATABASE movie_web_app;

CREATE TABLE users(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE movies(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL,
  CONSTRAINT fk_users
    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);