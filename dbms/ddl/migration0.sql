USE production;
ALTER TABLE `user`
ADD UNIQUE INDEX `unique_email` (`email`);