CREATE DATABASE bd_tp_ebooks;

-- ATENÇÃO: conecte-se ao banco de dados bd_tp_ebooks antes de executar os comandos abaixo.

CREATE TABLE autores (
	id_autor	SERIAL			NOT NULL,
	nome		VARCHAR(127)	NOT NULL
);

ALTER TABLE autores ADD
	CONSTRAINT autor_pk PRIMARY KEY (id_autor);

CREATE TABLE ebooks (
	id_ebook		SERIAL				NOT NULL,
	titulo			VARCHAR(127)		NOT NULL,
	ano_publicacao	INTEGER 			NOT NULL,
	num_paginas		INTEGER 			NOT NULL,
	preco			DOUBLE PRECISION	NOT NULL,
	sinopse			VARCHAR(255)			NULL,
	capa			VARCHAR(127)			NULL,
	id_genero		INTEGER 			NOT NULL,
	id_autor		INTEGER 			NOT NULL,
	qtd_downloads	INTEGER				NOT NULL DEFAULT 0
);

ALTER TABLE ebooks ADD
	CONSTRAINT ebooks_pk PRIMARY KEY (id_ebook);

CREATE TABLE generos (
	id_genero	SERIAL			NOT NULL,
	nome		VARCHAR(127)	NOT NULL
);

ALTER TABLE generos ADD
	CONSTRAINT genero_pk PRIMARY KEY (id_genero);

ALTER TABLE generos ADD
	CONSTRAINT genero_nome_un UNIQUE (nome);

CREATE TABLE usuarios (
	id_usuario	SERIAL			NOT NULL,
	nome		VARCHAR(255)	NOT NULL,
	email		VARCHAR(127)	NOT NULL,
	senha		VARCHAR(255)	NOT NULL,
	funcionario	BOOLEAN			NOT NULL DEFAULT false
);

ALTER TABLE usuarios ADD
	CONSTRAINT usuarios_pk PRIMARY KEY (id_usuario);

ALTER TABLE usuarios ADD
	CONSTRAINT usuarios_email_un UNIQUE (email);

CREATE TABLE vendas (
	id_venda				SERIAL				NOT NULL,
	id_usuario_comprador	INTEGER				NOT NULL,
	id_ebook				INTEGER				NOT NULL,
	data_compra				DATE				NOT NULL,
	preco_pago				DOUBLE PRECISION	NOT NULL
);

ALTER TABLE vendas ADD
	CONSTRAINT vendas_pk PRIMARY KEY (id_venda);

ALTER TABLE ebooks ADD
	CONSTRAINT ebooks_autor_fk FOREIGN KEY (id_autor)
	REFERENCES autores (id_autor);

ALTER TABLE ebooks ADD
	CONSTRAINT ebooks_genero_fk FOREIGN KEY (id_genero)
	REFERENCES generos (id_genero);

ALTER TABLE vendas ADD
	CONSTRAINT vendas_ebooks_fk FOREIGN KEY (id_ebook)
	REFERENCES ebooks (id_ebook)
	ON DELETE CASCADE;

ALTER TABLE vendas ADD
	CONSTRAINT vendas_usuarios_fk FOREIGN KEY (id_usuario_comprador)
	REFERENCES usuarios (id_usuario)
	ON DELETE CASCADE;
