CREATE DATABASE movie_web_app;
\c movie_web_app;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  release_year INTEGER NOT NULL,
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
      ON DELETE CASCADE,
  CONSTRAINT check_release_year_range
    CHECK (release_year >= 1900),
  CONSTRAINT check_duration_hours_range
    CHECK (duration_hours >= 0),
  CONSTRAINT check_duration_minutes_range
    CHECK (duration_minutes BETWEEN 0 AND 59),
  CONSTRAINT check_review_count_range
    CHECK (review_count >= 0)
);

CREATE TABLE reviews (
  user_id UUID NOT NULL,
  movie_id UUID NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  edited BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (user_id, movie_id),
  CONSTRAINT fk_reviews_users
    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,
  CONSTRAINT fk_reviews_movies
    FOREIGN KEY(movie_id)
      REFERENCES movies(id)
      ON DELETE CASCADE,
  CONSTRAINT check_rating_range
    CHECK (rating BETWEEN 0 AND 5)
);

INSERT INTO users (id, first_name, last_name, email, password) VALUES
  ('ad6631ea-9b0d-4e33-bd5f-940b6f0dd6c2', 'Abdullah', 'Umer', 'abdullah@gmail.com', '$2a$10$ZBN3l1gIVMiVN8KxCGev6.5fJcMNmfBdOpeh2oRBpOZABytcbPaLy'),
  ('e5b09172-3baf-4f3a-bd2e-cf51436dfad5', 'John', 'Doe', 'john@gmail.com', '$2a$10$2Mbpq4I4Q68cBGm5pakm.eHeIWZ/XyNZzpb0U/fBk98ESNIjUth3O');

INSERT INTO movies (id, title, description, release_year, duration_hours, duration_minutes, review_count, poster_url, trailer_url, created_at, user_id) VALUES
  ('64ffb1ed-4db7-44b1-a4b8-efb3462e1b57', 'Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 2010, 2, 28, 2, 'https://picsum.photos/seed/Inception/500/750', 'https://www.youtube.com/embed/B-yhF7IScUE', NOW(), 'e5b09172-3baf-4f3a-bd2e-cf51436dfad5'),
  ('c11e0d63-8508-4b0a-b080-abbcd57d1e33', 'Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 2014, 2, 49, 1, 'https://picsum.photos/seed/Interstellar/500/750', 'https://www.youtube.com/embed/8rbJkmz1n8E', NOW(), 'e5b09172-3baf-4f3a-bd2e-cf51436dfad5'),
  ('f5d942e5-5e4c-409e-99ec-3b0244d7e67c', 'The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 1999, 2, 16, 0, 'https://picsum.photos/seed/TheMatrix/500/750', 'https://www.youtube.com/embed/MjQG-a7d41Q', NOW(), 'ad6631ea-9b0d-4e33-bd5f-940b6f0dd6c2'),
  ('91c22b61-3c38-4a78-a6b0-167d1a111b29', 'The Matrix Reloaded', 'Neo and his allies race against time before the machines discover the city of Zion and destroy it.', 2003, 2, 18, 1, 'https://picsum.photos/seed/TheMatrixReloaded/500/750', 'https://www.youtube.com/embed/BXfxLIuNJvw', NOW(), 'ad6631ea-9b0d-4e33-bd5f-940b6f0dd6c2');

INSERT INTO reviews (user_id, movie_id, comment, rating, created_at) VALUES
  ('e5b09172-3baf-4f3a-bd2e-cf51436dfad5', '64ffb1ed-4db7-44b1-a4b8-efb3462e1b57', 'I was truly captivated by this movie; its mind-bending plot left me in awe!', 4, NOW()),
  ('e5b09172-3baf-4f3a-bd2e-cf51436dfad5', 'c11e0d63-8508-4b0a-b080-abbcd57d1e33', 'The portrayal of space and time in this film is nothing short of stunning; it''s a visual masterpiece.', 4, NOW()),
  ('ad6631ea-9b0d-4e33-bd5f-940b6f0dd6c2', '64ffb1ed-4db7-44b1-a4b8-efb3462e1b57', 'This sci-fi classic is truly revolutionary in its storytelling and themes; it''s a must-watch for any enthusiast of the genre.', 4, NOW()),
  ('ad6631ea-9b0d-4e33-bd5f-940b6f0dd6c2', '91c22b61-3c38-4a78-a6b0-167d1a111b29', 'The sequel manages to surpass its predecessor with its intense action scenes, keeping me on the edge of my seat throughout.', 4, NOW());