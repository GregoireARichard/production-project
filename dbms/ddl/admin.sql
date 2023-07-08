USE production;
CREATE TABLE IF NOT EXISTS `admin`(
    `id` INT AUTO_INCREMENT,
    PRIMARY KEY (`id`),
    `email` VARCHAR(255),
    UNIQUE INDEX `unique_email` (`email`),
    `password` TEXT
);
CREATE TABLE IF NOT EXISTS `exercise_group` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `is_active` BOOLEAN,
    `name` VARCHAR(255),
    UNIQUE INDEX `unique_name` (`name`)
);