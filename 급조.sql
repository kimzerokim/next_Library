SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `nextLibrary` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `nextLibrary` ;

-- -----------------------------------------------------
-- Table `nextLibrary`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `nextLibrary`.`user` ;

CREATE TABLE IF NOT EXISTS `nextLibrary`.`user` (
  `userNum` INT NOT NULL AUTO_INCREMENT,
  `userId` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `find_count` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`userNum`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nextLibrary`.`book`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `nextLibrary`.`book` ;

CREATE TABLE IF NOT EXISTS `nextLibrary`.`book` (
  `bookNum` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  `find_count` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`bookNum`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nextLibrary`.`user_has_book`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `nextLibrary`.`user_has_book` ;

CREATE TABLE IF NOT EXISTS `nextLibrary`.`user_has_book` (
  `cardNum` INT NOT NULL AUTO_INCREMENT,
  `userNum` INT NOT NULL,
  `bookNum` INT NOT NULL,
  PRIMARY KEY (`cardNum`),
  INDEX `fk_user_has_book_book1_idx` (`bookNum` ASC),
  INDEX `fk_user_has_book_user_idx` (`userNum` ASC),
  CONSTRAINT `fk_user_has_book_user`
    FOREIGN KEY (`userNum`)
    REFERENCES `nextLibrary`.`user` (`userNum`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_book_book1`
    FOREIGN KEY (`bookNum`)
    REFERENCES `nextLibrary`.`book` (`bookNum`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
