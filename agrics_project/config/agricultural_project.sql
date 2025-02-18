CREATE TABLE IF NOT EXISTS agrics_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('farmer', 'admin') DEFAULT 'farmer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agrics_projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    crop_type VARCHAR(255) NOT NULL,
    expected_yield FLOAT NOT NULL,
    land_size FLOAT NOT NULL,
    location VARCHAR(255) NOT NULL,
    land_size_unit VARCHAR(10) DEFAULT 'acres',
    expected_yield_unit VARCHAR(10) DEFAULT 'kgs',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES agrics_users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS agrics_inputs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category ENUM('fertilizer', 'pesticide', 'seed', 'other') NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    stock_unit VARCHAR(10) NOT NULL DEFAULT 'kg'
);


CREATE TABLE IF NOT EXISTS agrics_allocations (
     id INT PRIMARY KEY AUTO_INCREMENT,
     project_id INT NOT NULL,
     input_id INT NOT NULL,
     quantity INT NOT NULL,
     allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (project_id) REFERENCES agrics_projects(id) ON DELETE CASCADE,
     FOREIGN KEY (input_id) REFERENCES agrics_inputs(id) ON DELETE CASCADE
);