USE `competencias`;

CREATE TABLE `competencia` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` varchar(70) NOT NULL
);

INSERT INTO `competencia` (`nombre`) VALUES
('Que es esto 1?'),
('Que es esto 2?');

CREATE TABLE votos (
   pelicula_id int unsigned,
   competencia_id int,
   FOREIGN KEY (pelicula_id) REFERENCES pelicula(id),
   FOREIGN KEY (competencia_id) REFERENCES competencia(id)
);
