/*
 Navicat MySQL Data Transfer

 Source Server         : masql
 Source Server Type    : MySQL
 Source Server Version : 50731
 Source Host           : localhost:3306
 Source Schema         : testuser

 Target Server Type    : MySQL
 Target Server Version : 50731
 File Encoding         : 65001

 Date: 14/08/2023 12:17:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_details
-- ----------------------------
DROP TABLE IF EXISTS `user_details`;
CREATE TABLE `user_details`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) NULL DEFAULT NULL,
  `updated_at` datetime(3) NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  `gender` tinyint(1) NULL DEFAULT NULL,
  `aviator` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `user_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `desc` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `phone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_details_deleted_at`(`deleted_at`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_details
-- ----------------------------
INSERT INTO `user_details` VALUES (1, '2023-07-22 16:12:55.000', '2023-07-24 16:33:26.734', NULL, 0, '', 'admin', '我是第一个使用adoutme的用户admin1131', '15524529937113');
INSERT INTO `user_details` VALUES (3, '2023-07-22 17:00:19.958', '2023-07-22 17:00:19.958', NULL, 1, '', 'aa', '我是写好前后端后进行测试的', '112233');
INSERT INTO `user_details` VALUES (4, '2023-07-22 17:04:39.869', '2023-07-22 17:05:23.885', NULL, 1, '', 'bb', '完成收工吃饭', '1122333333');

-- ----------------------------
-- Table structure for user_friends
-- ----------------------------
DROP TABLE IF EXISTS `user_friends`;
CREATE TABLE `user_friends`  (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `friend_id` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `friend_id`) USING BTREE,
  INDEX `fk_user_friends_friends`(`friend_id`) USING BTREE,
  CONSTRAINT `fk_user_friends_friends` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_friends_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_friends
-- ----------------------------
INSERT INTO `user_friends` VALUES (3, 1);
INSERT INTO `user_friends` VALUES (5, 1);
INSERT INTO `user_friends` VALUES (6, 1);
INSERT INTO `user_friends` VALUES (7, 1);
INSERT INTO `user_friends` VALUES (1, 3);
INSERT INTO `user_friends` VALUES (6, 3);
INSERT INTO `user_friends` VALUES (10, 3);
INSERT INTO `user_friends` VALUES (1, 5);
INSERT INTO `user_friends` VALUES (1, 6);
INSERT INTO `user_friends` VALUES (3, 6);
INSERT INTO `user_friends` VALUES (1, 7);
INSERT INTO `user_friends` VALUES (3, 10);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) NULL DEFAULT NULL,
  `updated_at` datetime(3) NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  `user_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `psw` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_users_deleted_at`(`deleted_at`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '2023-07-21 16:43:33.363', '2023-07-24 22:49:41.234', NULL, 'admin', '123');
INSERT INTO `users` VALUES (2, '2023-07-21 16:43:43.142', '2023-07-21 16:43:43.142', NULL, 'test', '123');
INSERT INTO `users` VALUES (3, '2023-07-21 17:13:51.000', '2023-07-24 15:36:19.078', NULL, '特色', '123');
INSERT INTO `users` VALUES (4, '2023-07-21 18:03:24.207', '2023-07-22 06:49:51.475', NULL, 'aa', '123');
INSERT INTO `users` VALUES (5, '2023-07-21 18:03:31.141', '2023-07-24 20:25:40.184', NULL, 'bb', '123');
INSERT INTO `users` VALUES (6, '2023-07-21 18:03:36.583', '2023-07-24 22:45:31.750', NULL, 'cc', '123');
INSERT INTO `users` VALUES (7, '2023-07-21 18:03:44.506', '2023-07-24 22:49:41.220', NULL, 'dd', '123');
INSERT INTO `users` VALUES (8, '2023-07-21 18:03:49.033', '2023-07-21 18:03:49.033', NULL, 'ee', '123');
INSERT INTO `users` VALUES (9, '2023-07-21 18:03:54.271', '2023-07-21 18:03:54.271', NULL, 'ff', '123');
INSERT INTO `users` VALUES (10, '2023-07-21 18:03:59.820', '2023-07-24 15:31:37.298', NULL, 'gg', '123');
INSERT INTO `users` VALUES (11, '2023-07-21 18:04:09.611', '2023-07-21 18:04:09.611', NULL, 'hh', '123');
INSERT INTO `users` VALUES (12, '2023-07-21 18:04:15.285', '2023-07-21 18:04:15.285', NULL, 'ii', '123');
INSERT INTO `users` VALUES (13, '2023-07-21 18:04:19.912', '2023-07-21 18:04:19.912', NULL, 'jj', '123');

SET FOREIGN_KEY_CHECKS = 1;
