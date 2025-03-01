CREATE TABLE IF NOT EXISTS agrics_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO agrics_roles (role_name) VALUES ('user') ON DUPLICATE KEY UPDATE role_name = 'user';

CREATE TABLE IF NOT EXISTS agrics_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES agrics_roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agrics_elevate_demote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    target_user_id INT NOT NULL,
    action ENUM('elevate', 'demote') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES agrics_users(id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES agrics_users(id) ON DELETE CASCADE
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

CREATE TABLE IF NOT EXISTS agrics_project_inputs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    input_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES agrics_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (input_id) REFERENCES agrics_inputs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agrics_payment_modes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    details VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES agrics_users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

# INSERT INTO agrics_payment_modes (user_id, payment_method, details)
# VALUES (?, ?, ?)
# ON DUPLICATE KEY UPDATE user_id = VALUES(user_id);

CREATE TABLE IF NOT EXISTS ngrok_urls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agrics_payments (
   id INT PRIMARY KEY AUTO_INCREMENT,
   user_id INT NOT NULL,
   amount INT NOT NULL,
   mpesa_receipt_number VARCHAR(255) NOT NULL,
   mpesa_transaction_id VARCHAR(255) NOT NULL,
   mpesa_phone_number VARCHAR(20) NOT NULL,
   is_paid BOOLEAN DEFAULT FALSE,
   paid_at TIMESTAMP,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES agrics_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agrics_allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price INT NOT NULL DEFAULT 0,
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES agrics_projects(id) ON DELETE CASCADE
);


UPDATE agrics_allocations
SET price = quantity * 10;

DROP TRIGGER IF EXISTS set_price_before_insert;
CREATE TRIGGER set_price_before_insert
    BEFORE INSERT ON agrics_allocations
    FOR EACH ROW
    SET NEW.price = NEW.quantity * 10;

DROP TRIGGER IF EXISTS get_user_id_on_insert;
CREATE TRIGGER get_user_id_on_insert
BEFORE INSERT ON agrics_allocations
FOR EACH ROW
SET NEW.user_id = (SELECT user_id FROM agrics_projects WHERE id = NEW.project_id);



CREATE TABLE IF NOT EXISTS agrics_allocations_backup (
    id INT PRIMARY KEY AUTO_INCREMENT,
    allocation_id INT NOT NULL,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    quantity INT NOT NULL,
    allocated_at TIMESTAMP,
    backed_up_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (allocation_id) REFERENCES agrics_allocations(id) ON DELETE CASCADE
);

CREATE TRIGGER backup_and_zero_allocation
AFTER UPDATE ON agrics_payments
FOR EACH ROW
BEGIN
    IF NEW.is_paid THEN
        INSERT INTO agrics_allocations_backup (allocation_id, project_id, user_id, quantity, allocated_at)
        SELECT id, project_id, user_id, quantity, allocated_at
        FROM agrics_allocations
        WHERE id = NEW.agrics_allocations_id;

        UPDATE agrics_allocations
        SET quantity = 0
        WHERE id = NEW.agrics_allocations_id;
    END IF;
END;