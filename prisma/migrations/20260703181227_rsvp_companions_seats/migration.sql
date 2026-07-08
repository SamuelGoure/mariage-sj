-- AlterTable
ALTER TABLE `guests` ADD COLUMN `seats_allowed` INTEGER NOT NULL DEFAULT 4;

-- AlterTable
ALTER TABLE `rsvp` ADD COLUMN `name` VARCHAR(200) NULL;

-- Backfill name from legacy first_name/last_name before dropping them
UPDATE `rsvp` SET `name` = TRIM(CONCAT(`first_name`, ' ', `last_name`));

-- AlterTable
ALTER TABLE `rsvp`
    MODIFY COLUMN `name` VARCHAR(200) NOT NULL,
    DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    DROP COLUMN `meal_choice`,
    DROP COLUMN `allergies`,
    ADD COLUMN `companions` JSON NULL;
