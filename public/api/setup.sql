-- Setup Database for unseen_art studio
-- You can import this file directly into Hostinger PhpMyAdmin

CREATE TABLE IF NOT EXISTS paintings (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    medium VARCHAR(255) NOT NULL,
    dimensions VARCHAR(100) NOT NULL,
    year VARCHAR(10) NOT NULL,
    status ENUM('Available', 'Sold') DEFAULT 'Available',
    price VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    artwork VARCHAR(255) DEFAULT 'None',
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value VARCHAR(255) NOT NULL
);

-- Seed Initial Paintings (Matches current mock paintings)
INSERT INTO paintings (id, title, medium, dimensions, year, status, price, image, description) VALUES
('quiet-moments', 'Quiet Moments', 'Acrylic and mixed media on raw canvas', '36 x 48 inches', '2025', 'Available', 'INR 52,000', '/images/painting_1.png', 'An exploration of stillness and earthy structures. Built slowly with layers of gesso, marble dust, and acrylic washes, punctuated by thin graphite marks.'),
('memory-of-water', 'Memory of Water', 'Oil, ink, and gold leaf on canvas', '30 x 40 inches', '2026', 'Available', 'INR 48,000', '/images/painting_2.png', 'Capturing the fluid transition of thoughts, using indigo layers representing depth, and gold leaf representing light catching the surface of water.'),
('fields-of-gold', 'Fields of Gold', 'Acrylic and charcoal on canvas', '40 x 40 inches', '2025', 'Sold', 'INR 55,000', '/images/painting_3.png', 'A warm, textured painting highlighting the relationship between organic ochre fields and sharp structural charcoal grid lines.'),
('silent-reverie', 'Silent Reverie', 'Mixed media and pencil on paper', '24 x 32 inches', '2026', 'Available', 'INR 35,000', '/images/painting_4.png', 'A minimalist artwork focusing on negative space, light bone-colored fields, and delicate hand-drawn lines crossing the paper.'),
('echoes-of-silence', 'Echoes of Silence', 'Acrylic, sand, and copper leaf on canvas', '48 x 60 inches', '2026', 'Available', 'INR 72,000', '/images/painting_5.png', 'A heavy-textured dark canvas with deep charcoal sienna layers, incorporating coarse sand and copper leaf that shimmers in direct lighting.')
ON DUPLICATE KEY UPDATE id=id;

-- Seed default password 'surbhi_art_2026' (bcrypt hash)
-- You can change this password later in the admin settings or database.
INSERT INTO admin_settings (setting_key, setting_value) VALUES
('admin_password', '$2y$10$R9Z7u2hB1iB.Cig93Yn07ex2m6N8/R3Z5tM6lJ5k9Q2d8f9y5v2eG')
ON DUPLICATE KEY UPDATE setting_key=setting_key;
