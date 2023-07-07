USE production;
CREATE TABLE `admin`(
    `id` INT AUTO_INCREMENT,
    `email` VARCHAR(255),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `unique_email` (`email`),
    `password` TEXT
)
