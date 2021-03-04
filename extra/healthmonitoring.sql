-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 04/03/2021 às 01:35
-- Versão do servidor: 10.4.17-MariaDB
-- Versão do PHP: 7.4.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `healthmonitoring`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `dados`
--

CREATE TABLE `dados` (
  `ID` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `bpm` float NOT NULL,
  `oximetro` float NOT NULL,
  `temperatura` float NOT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `dados`
--

INSERT INTO `dados` (`ID`, `id_paciente`, `bpm`, `oximetro`, `temperatura`, `data`) VALUES
(4, 16, 49, 15, 32, '2021-03-03 18:32:49'),
(5, 16, 17, 15, 50, '2021-03-03 18:50:17'),
(6, 16, 5, 18, 46, '2021-03-03 21:46:05');

--
-- Gatilhos `dados`
--
DELIMITER $$
CREATE TRIGGER `dados_delete_log` AFTER DELETE ON `dados` FOR EACH ROW INSERT INTO system_log (operacao, usuario, data, tabela) VALUES
	('delete',USER(),NOW(),'dados')
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `dados_insert_log` AFTER INSERT ON `dados` FOR EACH ROW INSERT INTO system_log (operacao, usuario, data, tabela) VALUES
	('insert',USER(),NOW(),'dados')
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `dados_update_log` AFTER UPDATE ON `dados` FOR EACH ROW INSERT INTO system_log (operacao, usuario, data, tabela) VALUES
	('update',USER(),NOW(),'dados')
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `medicos`
--

CREATE TABLE `medicos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `especialidade` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `medicos`
--

INSERT INTO `medicos` (`id`, `id_usuario`, `especialidade`) VALUES
(5, 22, 'Dentes'),
(6, 34, 'Ossos');

--
-- Gatilhos `medicos`
--
DELIMITER $$
CREATE TRIGGER `medicos_delete_log` AFTER DELETE ON `medicos` FOR EACH ROW INSERT INTO system_log (operacao, usuario, data, tabela) VALUES
	('delete',USER(),NOW(),'medicos')
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `medicos_insert_log` AFTER INSERT ON `medicos` FOR EACH ROW INSERT INTO system_log (operacao, usuario, data, tabela) VALUES
	('insert',USER(),NOW(),'medicos')
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `medicos_update_log` AFTER UPDATE ON `medicos` FOR EACH ROW INSERT INTO system_log (operacao, usuario, data, tabela) VALUES
	('update',USER(),NOW(),'medicos')
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `pacientes`
--

INSERT INTO `pacientes` (`id`, `id_usuario`) VALUES
(16, 19),
(18, 23),
(26, 31),
(27, 32),
(29, 35);

--
-- Gatilhos `pacientes`
--
DELIMITER $$
CREATE TRIGGER `pacientes_delete_log` AFTER DELETE ON `pacientes` FOR EACH ROW INSERT INTO system_log (operacao, usuario, data, tabela) VALUES
	('delete',USER(),NOW(),'pacientes')
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `pacientes_insert_log` AFTER INSERT ON `pacientes` FOR EACH ROW INSERT INTO system_log (operacao, usuario, data, tabela) VALUES
	('insert',USER(),NOW(),'pacientes')
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `pacientes_update_log` AFTER UPDATE ON `pacientes` FOR EACH ROW INSERT INTO system_log (operacao, usuario, data, tabela) VALUES
	('update',USER(),NOW(),'pacientes')
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `rel_medico_paciente`
--

CREATE TABLE `rel_medico_paciente` (
  `id_paciente` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura para tabela `system_log`
--

CREATE TABLE `system_log` (
  `operacao` varchar(15) NOT NULL,
  `usuario` varchar(30) NOT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tabela` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `system_log`
--

INSERT INTO `system_log` (`operacao`, `usuario`, `data`, `tabela`) VALUES
('insert', 'root@localhost', '2021-02-24 19:39:13', 'dados'),
('update', 'root@localhost', '2021-02-24 19:43:56', 'medicos'),
('insert', 'root@localhost', '2021-02-24 22:02:51', 'pacientes'),
('insert', 'root@localhost', '2021-02-24 22:20:00', 'pacientes'),
('delete', 'root@localhost', '2021-02-24 22:20:12', 'pacientes'),
('insert', 'root@localhost', '2021-02-24 22:20:57', 'pacientes'),
('delete', 'root@localhost', '2021-02-24 22:21:18', 'pacientes'),
('insert', 'root@localhost', '2021-02-24 22:21:25', 'pacientes'),
('delete', 'root@localhost', '2021-02-24 22:22:31', 'pacientes'),
('insert', 'root@localhost', '2021-02-24 22:22:38', 'pacientes'),
('insert', 'root@localhost', '2021-02-24 22:25:16', 'pacientes'),
('update', 'root@localhost', '2021-02-24 22:25:16', 'pacientes'),
('delete', 'root@localhost', '2021-02-24 22:25:42', 'pacientes'),
('delete', 'root@localhost', '2021-02-24 22:28:41', 'pacientes'),
('insert', 'root@localhost', '2021-02-24 22:32:41', 'pacientes'),
('update', 'root@localhost', '2021-02-24 22:32:59', 'pacientes'),
('delete', 'root@localhost', '2021-02-24 22:33:16', 'pacientes'),
('delete', 'root@localhost', '2021-02-25 17:22:27', 'medicos'),
('delete', 'root@localhost', '2021-02-25 17:22:47', 'pacientes'),
('delete', 'root@localhost', '2021-02-25 17:22:48', 'pacientes'),
('delete', 'root@localhost', '2021-02-25 17:22:56', 'dados'),
('insert', 'root@localhost', '2021-02-28 15:03:10', 'pacientes'),
('insert', 'root@localhost', '2021-02-28 17:49:29', 'medicos'),
('delete', 'root@localhost', '2021-02-28 17:53:08', 'medicos'),
('insert', 'root@localhost', '2021-02-28 17:53:22', 'medicos'),
('insert', 'root@localhost', '2021-02-28 17:55:17', 'pacientes'),
('update', 'root@localhost', '2021-02-28 21:16:52', 'pacientes'),
('delete', 'root@localhost', '2021-02-28 21:31:36', 'pacientes'),
('delete', 'root@localhost', '2021-02-28 21:33:09', 'pacientes'),
('insert', 'root@localhost', '2021-02-28 21:35:54', 'pacientes'),
('delete', 'root@localhost', '2021-02-28 21:37:01', 'pacientes'),
('insert', 'root@localhost', '2021-02-28 21:37:20', 'pacientes'),
('update', 'root@localhost', '2021-02-28 21:41:46', 'pacientes'),
('delete', 'root@localhost', '2021-02-28 21:43:15', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 13:45:45', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 13:54:13', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 13:54:18', 'medicos'),
('insert', 'root@localhost', '2021-03-03 14:29:35', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 14:34:30', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 15:43:13', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 17:53:57', 'medicos'),
('insert', 'root@localhost', '2021-03-03 17:55:11', 'medicos'),
('update', 'root@localhost', '2021-03-03 17:59:51', 'medicos'),
('delete', 'root@localhost', '2021-03-03 18:01:07', 'medicos'),
('insert', 'root@localhost', '2021-03-03 18:32:49', 'dados'),
('insert', 'root@localhost', '2021-03-03 18:50:17', 'dados'),
('insert', 'root@localhost', '2021-03-03 21:36:27', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 21:46:05', 'dados'),
('insert', 'root@localhost', '2021-03-03 21:52:02', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 21:52:23', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 22:41:04', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 23:09:08', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 23:17:13', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 23:17:17', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 23:17:33', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 23:18:41', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 23:19:37', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 23:20:10', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 23:22:39', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 23:22:42', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 23:22:46', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 23:22:49', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 23:25:20', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 23:26:54', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 23:27:13', 'pacientes'),
('delete', 'root@localhost', '2021-03-03 23:28:23', 'pacientes'),
('insert', 'root@localhost', '2021-03-03 23:34:54', 'medicos'),
('insert', 'root@localhost', '2021-03-04 00:25:20', 'pacientes');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cpf` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `telefone` varchar(14) NOT NULL,
  `tipo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `cpf`, `email`, `senha`, `telefone`, `tipo`) VALUES
(19, 'Jorge 5', '190', 'jorge@gmail.com', '123', '9090', 'paciente'),
(22, 'Tiradentes', '2133', 'tiradentes@gmail.com', '123', '1423', 'medico'),
(23, 'Ruan Felipe', '21312', 'felipealmeida@.com', '12345', '124124', 'paciente'),
(31, 'Felipe 4', '213', 'felipe4@gmail.com', '$2a$15$ORV79mr3basadTw1arV/GeriX4XfoBFYcpe8hy/YrgMmQT5Bz8Caa', '124124', 'paciente'),
(32, 'Felipe 5', '123123', 'felipe5@gmail.com', '$2a$10$OPczHwzTCU/QRq..w2vNIuJPDFygXhkxQeX1ugjoi9RB21DsRgCVq', '2133', 'paciente'),
(34, 'Dom Pedro I', '1312', 'dompedro1@gmail.com', '$2a$10$04iw2NOsxyEq0np2ABpyceJC9elAHFvFxcvXuVVRzuNEGeO/KOBMq', '32131', 'medico'),
(35, 'Felipe 7', '21312', 'felipe7@gmail.com', '$2a$10$uz5/IV81fjO/nEXuCyLLlO7OOT3MK4y5dId3RlH04uMSKQk6uKpzK', '2133', 'paciente');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `dados`
--
ALTER TABLE `dados`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `dados_fkey` (`id_paciente`);

--
-- Índices de tabela `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_medico_fkey` (`id_usuario`);

--
-- Índices de tabela `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_fkey` (`id_usuario`);

--
-- Índices de tabela `rel_medico_paciente`
--
ALTER TABLE `rel_medico_paciente`
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_medico` (`id_medico`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `dados`
--
ALTER TABLE `dados`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `dados`
--
ALTER TABLE `dados`
  ADD CONSTRAINT `dados_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`);

--
-- Restrições para tabelas `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `usuario_medico_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Restrições para tabelas `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Restrições para tabelas `rel_medico_paciente`
--
ALTER TABLE `rel_medico_paciente`
  ADD CONSTRAINT `rel_medico_paciente_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id`),
  ADD CONSTRAINT `rel_medico_paciente_ibfk_3` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
