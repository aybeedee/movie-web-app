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
  title VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  review_count INTEGER NOT NULL DEFAULT 0,
  poster_url TEXT NOT NULL,
  trailer_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  user_id UUID NOT NULL,
  CONSTRAINT fk_movies_users
    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);

CREATE TABLE reviews (
  user_id UUID NOT NULL,
  movie_id UUID NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  edited BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (user_id, movie_id)
  CONSTRAINT fk_reviews_users
    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  CONSTRAINT fk_reviews_movies
    FOREIGN KEY(movie_id)
      REFERENCES movies(id)
      ON DELETE CASCADE
  CONSTRAINT check_rating_range
    CHECK (rating BETWEEN 0 AND 5)
);