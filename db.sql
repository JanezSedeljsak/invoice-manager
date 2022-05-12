drop database if exists invoice_manager;
create database invoice_manager;
use invoice_manager;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+02:00";

DROP TABLE IF EXISTS `group_shopping_item`;
DROP TABLE IF EXISTS `store`;
DROP TABLE IF EXISTS `group_user`;
DROP TABLE IF EXISTS `invoice`;
DROP TABLE IF EXISTS `group`;
DROP TABLE IF EXISTS `auth`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
  `fullname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `store` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
  `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `auth` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
  `expiration` DATETIME NOT NULL DEFAULT DATE_ADD(NOW(), INTERVAL 1 DAY),
  `user_id` VARCHAR(36) NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `token` VARCHAR(255) NOT NULL
);

CREATE TABLE `group` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE `invoice` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
  `image` VARCHAR(255) NULL,
  `date` DATETIME NOT NULL DEFAULT NOW(),
  `user_id` VARCHAR(36) NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `group_id` VARCHAR(36) NULL REFERENCES `group`(`id`) ON DELETE CASCADE,
  `store_id` VARCHAR(36) NULL REFERENCES `store`(`id`) ON DELETE CASCADE,
  `amount` INT NOT NULL,
  `notes` TEXT NULL
);

CREATE TABLE `group_user` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
  `joined_at` DATETIME NOT NULL DEFAULT NOW(),
  `group_id` VARCHAR(36) NOT NULL REFERENCES `group`(`id`) ON DELETE CASCADE,
  `user_id` VARCHAR(36) NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `added_by` VARCHAR(36) NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `group_shopping_item` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
  `group_id` VARCHAR(36) NOT NULL REFERENCES `group`(`id`) ON DELETE CASCADE,
  `name` VARCHAR(255) NOT NULL
);

INSERT INTO `store` (name) VALUES
('Spar'),
('Tuš'),
('Merkator'),
('Ikea'),
('Hervis'),
('Merkur'),
('Hofer'),
('Lidl'),
('Muller'),
('Intersport'),
('Other');

/* geslo je v vseh primerih geslo123 */
INSERT INTO `user` (fullname, email, password) VALUES
('Janez Sedeljsak', 'janez.sedeljsak@gmail.com', '75646eb98783039437f60f7b837e18d25f6e83c95b55b356dd5f29eb65309f05'),
('Luka Pavcnik', 'luka.pavcnik@gmail.com', '73b358223e3fef80c98dd04c5194687d5cca4f48676685db6d8b9b0f47e49b71'),
('John Doe',  'john.doe@gmail.com', '167e229443e853fc44c951f4c9e675f864625a59909239a1d3546edb440355e0'),
('Lorem Ipsum',  'lorem.ipsum@gmail.com', 'ce9c8f730d487fe79926558bdf1c2bfa5d93e51b434a994d9246123c786b3023'),
('Janez Novak', 'janez.novak@gmail.com', '2b65bbecc072006f0d92b5c3b0d2685181b9cf76bfcbd132ffdc999a2cfff19d'),
('Katja', 'katja@gmail.com', '3988291dff72e7dba7df1772c217c51ca72ff8b95e92a8033905cef8aacd50e6'),
('Indi', 'indi@gmail.com', '7dd8e5459eb148216eb651e4057a7da94e132dc1324133e4962bad0e37253658'),
('Francka Novak Neki', 'francka@gmail.com', '274e617849c8d3ad8dfdecb1b7b79d5bed43d456c78afd89e27013c79eaa4cfb');

INSERT INTO `group` (name) VALUES 
('Veselo Stanovanje'), 
('Domaca zapravljanja'), 
('Janezi'),
('John, Lorem pa Francka');


