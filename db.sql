drop database if exists invoice_manager;
create database invoice_manager;
use invoice_manager;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+02:00";

DROP TABLE IF EXISTS `group_invoice`;
DROP TABLE IF EXISTS `group_user`;
DROP TABLE IF EXISTS `invoice`;
DROP TABLE IF EXISTS `group`;
DROP TABLE IF EXISTS `auth`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `fullname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `auth` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `expiration` DATETIME NOT NULL DEFAULT DATE_ADD(NOW(), INTERVAL 1 DAY),
  `user_id` INT NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `token` VARCHAR(255) NOT NULL
);

CREATE TABLE `invoice` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `image` VARCHAR(255) NULL,
  `date` DATETIME NOT NULL DEFAULT NOW(),
  `user_id` INT NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `amount` INT NOT NULL,
  `notes` TEXT NULL
);

CREATE TABLE `group` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE `group_user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `group_id` INT NOT NULL REFERENCES `group`(`id`) ON DELETE CASCADE,
  `user_id` INT NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `group_invoice` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `group_id` INT NOT NULL REFERENCES `group`(`id`) ON DELETE CASCADE,
  `invoice_id` INT NOT NULL REFERENCES `invoice`(`id`) ON DELETE CASCADE
);


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
('John, Lorem pa Francka')


