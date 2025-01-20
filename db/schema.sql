CREATE DATABASE classflow;

USE classflow;

CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    dataNascimento DATE NOT NULL,
    curso VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE disciplinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    cargaHoraria INT NOT NULL,
    descricao TEXT,
    status ENUM('Pendente', 'Concluída') NOT NULL,
    alunoId INT NOT NULL,
    FOREIGN KEY (alunoId) REFERENCES alunos(id)
);
