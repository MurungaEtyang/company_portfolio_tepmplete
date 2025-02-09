CREATE TABLE IF NOT EXISTS x_username (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS x_bearer_token (
    id SERIAL PRIMARY KEY,
    bearer_token VARCHAR(255) NOT NULL UNIQUE,
    api_key VARCHAR(255) NOT NULL,
    api_key_secret VARCHAR(255) NOT NULL,
    access_token_secret VARCHAR(255) NOT NULL,
    access_token VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL REFERENCES x_username(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS x_linked_account (
    id SERIAL PRIMARY KEY,
    latest_post_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS x_reply_tweets (
    id SERIAL PRIMARY KEY,
    bearer_token VARCHAR(255) NOT NULL REFERENCES x_bearer_token(bearer_token),
    tweet_id VARCHAR(255) NOT NULL,
    reply_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);