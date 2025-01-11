-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 07 يناير 2025 الساعة 14:49
-- إصدار الخادم: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `village_management`
--

-- --------------------------------------------------------

--
-- بنية الجدول `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `imgBase64` longtext DEFAULT NULL,
  `imgText` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender` varchar(255) DEFAULT NULL,
  `recipient` varchar(255) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `is_logged_in` tinyint(1) DEFAULT 0,
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `role`, `is_logged_in`, `profile_image`) VALUES
(1, 'wafaa', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'wafaa_hamed', 'admin', 0, NULL),
(2, 'john_doe', 'b4b597c714a8f49103da4dab0266af0ee0ae4f8575250a84855c3d76941cd422', 'Jane Smith', 'user', 0, NULL),
(3, 'aseel', '27545b395a8e5915b48557d0e26ef3e05e368d0f65ae786a806df38f9f4e3bc5', 'aseel_zaid', 'admin', 0, 'aseel.png'),
(4, 'mark_twain', '43d9423892ab14c9da8388f7036067fa0a15b5663e563f22d3383cfc933c1690', 'Mark Twain', 'user', 0, NULL),
(5, 'sara_connor', '926b4b8a00cfab44b758450fa6bf188d4bf8541c2fd6b3d9b93d152d43a99f64', 'Sara Connor', 'user', 1, NULL),
(6, 'shifaa', 'becf77f3ec82a43422b7712134d1860e3205c6ce778b08417a7389b43f2b4661', 'shifaa_barham', 'admin', 0, NULL);

-- --------------------------------------------------------

--
-- بنية الجدول `villages`
--

CREATE TABLE `villages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `land_area` float NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `image` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `population` int(11) NOT NULL,
  `population_distribution` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`population_distribution`)),
  `gender_ratios` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gender_ratios`)),
  `population_growth_rate` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `villages`
--

INSERT INTO `villages` (`id`, `name`, `region`, `land_area`, `latitude`, `longitude`, `image`, `tags`, `population`, `population_distribution`, `gender_ratios`, `population_growth_rate`) VALUES
(1, 'Battir', 'Bethlehem', 7.4, 31.715, 35.151, 'battir.jpg', 'rural,historical,agricultural', 4500, '{\"0-18\":25,\"19-35\":40,\"36-50\":20,\"51-65\":10,\"65+\":5}', '{\"male\":52,\"female\":48}', 1.7),
(2, 'Sebastia', 'Nablus', 16, 32.276, 35.198, 'sebastia.jpg', 'rural,historical,touristic', 4000, '{\"0-18\":28,\"19-35\":45,\"36-50\":15,\"51-65\":8,\"65+\":4}', '{\"male\":51,\"female\":49}', 2.1),
(3, 'Arraba', 'Jenin', 27, 32.414, 35.155, 'arraba.jpeg', 'rural,agricultural', 11000, '{\"0-18\":30,\"19-35\":40,\"36-50\":20,\"51-65\":7,\"65+\":3}', '{\"male\":50,\"female\":50}', 2.8),
(4, 'Kufr Aqab', 'Jerusalem', 5.6, 31.857, 35.221, 'kufr_aqab.jpg', 'urban,developing', 25000, '{\"0-18\":32,\"19-35\":50,\"36-50\":12,\"51-65\":4,\"65+\":2}', '{\"male\":51,\"female\":49}', 3.5),
(5, 'Beit Sahour', 'Bethlehem', 10.2, 31.704, 35.212, 'beit_sahour.jpg', 'urban,touristic,historical', 15000, '{\"0-18\":28,\"19-35\":45,\"36-50\":18,\"51-65\":7,\"65+\":2}', '{\"male\":50,\"female\":50}', 2),
(6, 'Jericho', 'Jericho', 58, 31.853, 35.458, 'jericho.jpg', 'touristic,urban,agricultural', 20000, '{\"0-18\":30,\"19-35\":40,\"36-50\":15,\"51-65\":10,\"65+\":5}', '{\"male\":52,\"female\":48}', 1.9),
(7, 'Hebron', 'Hebron', 74, 31.529, 35.093, 'hebron.jpg', 'urban,historical,industrial', 300000, '{\"0-18\":35,\"19-35\":45,\"36-50\":10,\"51-65\":5,\"65+\":5}', '{\"male\":51,\"female\":49}', 2.5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `villages`
--
ALTER TABLE `villages`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `villages`
--
ALTER TABLE `villages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
