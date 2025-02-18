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

CREATE TABLE IF NOT EXISTS twitter_tokens (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS account_to_interact (
    id SERIAL PRIMARY KEY,
    account_username VARCHAR(255) NOT NULL,
    linked_account_username VARCHAR(255) NOT NULL,
    follow BOOLEAN NOT NULL DEFAULT FALSE,
    likes BOOLEAN NOT NULL DEFAULT FALSE,
    retweet BOOLEAN NOT NULL DEFAULT FALSE,
    quote BOOLEAN NOT NULL DEFAULT FALSE,
    comment_total INT NOT NULL DEFAULT 0 CHECK (comment_total >= 0),
    comment_current INT NOT NULL DEFAULT 0 CHECK (comment_current >= 0),
    trigger_comment BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_linked_account FOREIGN KEY (linked_account_username)
    REFERENCES x_linked_account(username) ON DELETE CASCADE,
    CONSTRAINT fk_account_username FOREIGN KEY (account_username)
    REFERENCES x_username(username) ON DELETE CASCADE
);
