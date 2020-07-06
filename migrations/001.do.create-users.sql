CREATE TABLE users (
    user_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
);