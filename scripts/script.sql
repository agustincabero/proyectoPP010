USE `competencias`;

CREATE TABLE `competencia` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` varchar(70) NOT NULL,
  `genero_id` int unsigned,
  `actor_id` int unsigned,
  `director_id` int unsigned,
  FOREIGN KEY (genero_id) REFERENCES genero(id),
  FOREIGN KEY (actor_id) REFERENCES actor(id),
  FOREIGN KEY (director_id) REFERENCES director(id)
);

INSERT INTO `competencia` (`nombre`, `genero_id`) VALUES
('Que es esto 1?', 1),
('Que es esto 2?', 2);

CREATE TABLE votos (
   pelicula_id int unsigned,
   competencia_id int,
   FOREIGN KEY (pelicula_id) REFERENCES pelicula(id),
   FOREIGN KEY (competencia_id) REFERENCES competencia(id)
);
