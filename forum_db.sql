-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: forum_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_login`
--

DROP TABLE IF EXISTS `admin_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_login`
--

LOCK TABLES `admin_login` WRITE;
/*!40000 ALTER TABLE `admin_login` DISABLE KEYS */;
INSERT INTO `admin_login` VALUES (1,'admin@example.com','admin123','2025-01-16 18:41:20');
/*!40000 ALTER TABLE `admin_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment` text NOT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `comments_ibfk_3` (`parent_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deletion_alerts`
--

DROP TABLE IF EXISTS `deletion_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deletion_alerts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('post','comment','reply','profile') NOT NULL,
  `reason` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deletion_alerts`
--

LOCK TABLES `deletion_alerts` WRITE;
/*!40000 ALTER TABLE `deletion_alerts` DISABLE KEYS */;
INSERT INTO `deletion_alerts` VALUES (7,33,'reply','delted by me','2025-04-07 13:57:08'),(8,33,'comment','im deleting this one sorryyy','2025-04-07 14:03:22'),(9,33,'comment','need to delete','2025-04-07 14:10:21'),(26,2,'comment','dewe','2025-04-11 04:40:42'),(27,6,'post','spamiiiiiiiiif','2025-04-11 04:41:41');
/*!40000 ALTER TABLE `deletion_alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usability` tinyint NOT NULL,
  `design` tinyint NOT NULL,
  `features` tinyint NOT NULL,
  `satisfaction` tinyint NOT NULL,
  `comments` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `avg_rating` decimal(3,2) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `feedback_ibfk_1` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_chk_1` CHECK ((`usability` between 1 and 5)),
  CONSTRAINT `feedback_chk_2` CHECK ((`design` between 1 and 5)),
  CONSTRAINT `feedback_chk_3` CHECK ((`features` between 1 and 5)),
  CONSTRAINT `feedback_chk_4` CHECK ((`satisfaction` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `privacy` enum('public','private') DEFAULT 'public',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (209,2,'Top 10 Study Tips for College Students must be followed','Studying effectively is crucial for academic success. In this article, we discuss the top 10 study techniques, including time management, active recall, the Pomodoro technique, and creating a distraction-free environment to improve productivity','2025-04-08 16:47:19','img_67f55317cfba0.jpg',NULL,'Lifestyle','public','2025-04-09 09:14:06');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reactions`
--

DROP TABLE IF EXISTS `reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reactions` (
  `reaction_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reaction` enum('like','dislike') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reactions`
--

LOCK TABLES `reactions` WRITE;
/*!40000 ALTER TABLE `reactions` DISABLE KEYS */;
INSERT INTO `reactions` VALUES (1,60,14,'like','2025-01-19 05:21:22'),(2,53,14,'like','2025-01-19 05:21:29'),(3,61,15,'like','2025-01-19 05:39:08'),(4,61,12,'like','2025-01-19 05:23:01'),(5,53,15,'like','2025-01-19 05:39:25'),(6,53,12,'dislike','2025-01-19 05:28:34'),(7,64,19,'like','2025-01-19 05:46:48'),(8,70,20,'like','2025-01-19 08:39:04'),(9,71,20,'like','2025-01-24 16:46:42'),(10,63,20,'like','2025-01-24 16:47:02'),(11,72,21,'like','2025-02-17 04:15:43'),(12,73,22,'like','2025-02-17 07:50:04'),(13,87,26,'like','2025-02-24 15:05:23'),(14,98,26,'like','2025-02-24 15:05:54'),(15,117,26,'like','2025-02-28 13:33:24'),(16,174,26,'like','2025-02-28 18:42:07'),(17,173,26,'like','2025-02-28 18:42:11'),(18,172,26,'like','2025-02-28 18:42:16'),(19,161,26,'dislike','2025-02-28 18:42:40'),(20,74,26,'like','2025-02-28 18:50:05'),(21,75,26,'like','2025-02-28 18:50:41'),(22,167,26,'dislike','2025-02-28 18:51:09'),(23,170,23,'like','2025-02-28 18:53:21'),(24,75,23,'dislike','2025-02-28 18:53:44'),(25,180,27,'dislike','2025-02-28 22:48:17'),(26,181,27,'like','2025-03-01 05:43:35'),(27,189,23,'dislike','2025-03-01 19:08:29'),(28,187,23,'dislike','2025-03-01 18:34:58'),(29,186,23,'like','2025-03-01 19:09:41'),(30,185,23,'dislike','2025-03-01 18:35:06'),(31,184,23,'dislike','2025-03-01 18:35:10'),(32,192,30,'like','2025-03-24 04:36:31'),(33,193,30,'like','2025-03-24 04:42:57'),(34,194,30,'dislike','2025-03-24 06:05:32'),(35,194,28,'dislike','2025-03-24 06:07:24'),(36,195,31,'like','2025-03-30 16:22:27'),(37,192,31,'dislike','2025-03-30 18:46:54'),(38,197,31,'like','2025-03-31 03:13:14'),(39,197,28,'dislike','2025-03-30 18:56:12'),(40,198,28,'like','2025-03-30 19:03:59'),(41,199,28,'like','2025-03-31 03:21:28'),(42,199,32,'like','2025-03-31 03:22:47'),(43,198,32,'dislike','2025-03-31 03:23:46'),(44,197,32,'like','2025-03-31 03:23:54'),(45,199,31,'like','2025-03-31 18:35:54'),(46,200,31,'like','2025-04-07 04:20:00'),(47,204,33,'like','2025-04-07 13:37:05'),(48,197,33,'like','2025-04-07 13:37:34'),(49,203,33,'like','2025-04-07 14:09:58'),(50,205,35,'like','2025-04-07 18:36:17'),(51,211,5,'like','2025-04-09 03:49:41'),(52,208,1,'like','2025-04-09 06:26:40'),(53,211,1,'dislike','2025-04-09 03:49:07'),(54,209,1,'like','2025-04-09 03:49:14'),(55,209,5,'like','2025-04-09 03:49:52'),(56,211,2,'like','2025-04-09 03:56:04');
/*!40000 ALTER TABLE `reactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `replies`
--

DROP TABLE IF EXISTS `replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `replies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reply` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `comment_id` (`comment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `replies_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `replies_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `replies`
--

LOCK TABLES `replies` WRITE;
/*!40000 ALTER TABLE `replies` DISABLE KEYS */;
/*!40000 ALTER TABLE `replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `login_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Nikhil Wagh','nikhil10110101','nwagh008@gmail.com','$2y$10$wCIENhPy5UfZHELM.bQmcO4EYGptUIIxOshY1e7rE45S3.GdV/b7W','2025-04-08 16:46:24',NULL),(6,'Sujal Tawale','sujal123','sujal15@gmail.com','$2y$10$vqMSL31jjJ6TTAucchE9lewNcuPY6Z1OgVejyGCeUWk3iPRMpjUnS','2025-04-09 06:35:05',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-11 10:14:16
