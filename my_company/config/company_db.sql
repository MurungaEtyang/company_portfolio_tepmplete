DROP TRIGGER IF EXISTS set_nimrod_users_timestamp ON nimrod_users;
DROP TRIGGER IF EXISTS set_nimrod_users_personal_data_timestamp ON nimrod_users_personal_data;
DROP TRIGGER IF EXISTS set_book_appointments_timestamp ON book_appointments;
DROP TRIGGER IF EXISTS set_nimrod_user_role_permissions_timestamp ON nimrod_user_role_permissions;
DROP TRIGGER IF EXISTS set_projects_timestamp ON projects;
DROP TRIGGER IF EXISTS set_project_statuses_timestamp ON project_statuses;
DROP INDEX IF EXISTS idx_projects_user_id;

CREATE OR REPLACE FUNCTION update_timestamp_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS nimrod_users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL DEFAULT 'user',
    confirmation_code VARCHAR(255) DEFAULT NULL,
    confirmation_code_expiry TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_confirmed BOOLEAN DEFAULT FALSE,
    registration_ip VARCHAR(255) DEFAULT NULL,
    location TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_nimrod_users_timestamp
    BEFORE UPDATE ON nimrod_users
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

CREATE INDEX IF NOT EXISTS idx_nimrod_users_email ON nimrod_users(email);

CREATE TABLE IF NOT EXISTS nimrod_roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS nimrod_user_role_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES nimrod_users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES nimrod_roles(id) ON DELETE CASCADE,
    permission VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_nimrod_user_role_permissions_timestamp
    BEFORE UPDATE ON nimrod_user_role_permissions
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

CREATE TABLE IF NOT EXISTS nimrod_users_personal_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES nimrod_users(id) ON DELETE CASCADE,
  birth_date DATE NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  phone_number VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  country VARCHAR(255) NOT NULL,
  nationality VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_nimrod_users_personal_data_timestamp
    BEFORE UPDATE ON nimrod_users_personal_data
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

CREATE TABLE IF NOT EXISTS book_appointments (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES nimrod_users(id) ON DELETE CASCADE,
     appointment_date TIMESTAMP NOT NULL,
     mps_name VARCHAR(255) NOT NULL,
     purpose TEXT NOT NULL,
     status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_book_appointments_timestamp
    BEFORE UPDATE ON book_appointments
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

CREATE INDEX IF NOT EXISTS idx_book_appointments_user_id ON book_appointments(user_id);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES nimrod_users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(15,2) DEFAULT 0,
    deadline TIMESTAMP,
    status VARCHAR(50) DEFAULT 'in-progress',
    visibility VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO statuses (status)
VALUES ('planned'), ('in-progress'), ('completed'), ('publish'), ('draft')
ON CONFLICT (status) DO NOTHING;


CREATE TABLE IF NOT EXISTS statuses (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO statuses (status)
VALUES
    ('planned'),
    ('in-progress'),
    ('completed')
ON CONFLICT (status) DO NOTHING;

CREATE TABLE IF NOT EXISTS project_statuses (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    status_id INTEGER REFERENCES statuses(id) ON DELETE CASCADE DEFAULT (SELECT id FROM statuses WHERE status = 'in-progress'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, status_id)
);

CREATE TRIGGER set_projects_timestamp
    BEFORE UPDATE ON projects
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER set_project_statuses_timestamp
    BEFORE UPDATE ON project_statuses
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_statuses_project_id ON project_statuses(project_id);

