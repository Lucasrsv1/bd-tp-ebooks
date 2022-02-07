-- usuários
INSERT INTO usuarios (id_usuario, nome, email, senha, funcionario) VALUES
	-- Senha: 1234567
	(1, 'Lucas Alexsanderson da Fonesca', 'lucas@cefet.com.br', 'ecf6980df0239914350507790b22a0422c2202b11a733a2f56bc4c02ab325cad2e0fef11f543e691772b81da638ac308172d7b994cf0b25b856e9d6a93e701f2', false),
	-- Senha: 12345678
	(2, 'Gabriel Ferreira dos Santos', 'gabriel@cefet.com.br', '5605b76cdd822e8ad32ba9cc29d4866b6338cde10c138439e557b42e14245a47adf370bb8cc767865290bf427920f17b8a292706e2beb1f4ed1b9d4170cdfe9b', false),
	-- Senha: 123456789
	(3, 'Israel Amaral Linhares Terra', 'israel@cefet.com.br', '875f07c56e3163449852e8ecfe6831328354a1637f399ae17a99d51fd12247404385050a4bbcae5a0699ad7efd0bb73c19779c14ce3541d9c6845101f864842b', false),
	-- Senha: 1234567891
	(4, 'Lucas Rassilan Vilanova', 'rassilan@cefet.com.br', 'd4e85d11dc4ad2dba66a73185d5c555d1f8918fd6856ada5da3cd2617a38d0b3aae08f35fb8db463e8f3a7b5f8b0bece02f3d89817d89eec2c4451a9888443dc', false),
	-- Senha: 12345678912
	(5, 'abganel', 'abganel@cefet.com.br', '0af337347c5b0fa6c16ed50d03400938689ba1e1c85a7a2989fe2332d83001eb2a66e10fae11118d6608ce8fc23df8ec4411bab1771f731b004e7fc25ec9b7fb', true);

SELECT setval('usuarios_id_usuario_seq', 6, true);

-- genero
INSERT INTO generos (id_genero, nome) VALUES
	(1, 'Suspense'),
	(2, 'Fantasia'),
	(3, 'Horror'),
	(4, 'Romance'),
	(5, 'Sociologia');

SELECT setval('generos_id_genero_seq', 6, true);

-- autor
INSERT INTO autores (id_autor, nome) VALUES
	(1, 'J. K. Rowling'),
	(2, 'Suzanne Collins'),
	(3, 'Alexandre Dumas, pai'),
	(4, 'Anna Todd'),
	(5, 'Dennis Prager');

SELECT setval('autores_id_autor_seq', 6, true);

-- ebook
INSERT INTO ebooks (id_ebook, id_genero, id_autor, titulo, ano_publicacao, num_paginas, preco, sinopse, capa) VALUES
	(1, 1, 1, 'Harry Potter e a Pedra Filosofal', 1997, 223, 24.50, 'Quando virou o envelope, com a mão trêmula, Harry viu um lacre de cera púrpura com um brasão; um leão, uma águia, um texugo e uma cobra circulando uma grande letra "H".', '1644179997489.jpg'),
	(2, 2, 2, 'Jogos Vorazes', 2008, 374, 40, 'Para evitar que sua irmã seja a mais nova vítima do programa, Katniss se oferece para participar em seu lugar. Vinda do empobrecido Distrito 12, ela sabe como sobreviver em um ambiente hostil.', '1644179968753.jpg'),
	(3, 3, 3, 'O Conde de Monte Cristo', 1846, 1300, 41.59, 'O conde de Monte-Cristo gira em torno de Edmond Dantè, que é preso por um crime que não cometeu. Ao sair da prisão, Edmond vai à busca de vingança contra seus inimigos. Uma trama repleta de reviravoltas dignas de um jogo de xadrez.', '1644179933959.jpg'),
	(4, 4, 4, 'After', 2014, 528, 29.5, 'There was the time before Tessa met Hardin, and then there is everything AFTER... Life will never be the same.', '1644179890637.jpg'),
	(5, 5, 5, 'Still the Best Hope: Why the World Needs American Values to Triumph', 2012, 453, 37.90, 'American values must triumph in a dangerously uncertain world. The alternatives to the American Trinity of liberty, natural rights, and the melting-pot ideal of national unity are Islamic totalitarianism or European democratic socialism.', '1644180447807.jpg');

SELECT setval('ebooks_id_ebook_seq', 6, true);

-- vendas
INSERT INTO vendas (id_usuario_comprador, id_ebook, data_compra, preco_pago) VALUES
	(1, 1, TO_DATE('13-JAN-2022', 'dd-MON-yyyy'), 24.50),
	(2, 4, TO_DATE('13-JAN-2022', 'dd-MON-yyyy'), 29.5),
	(3, 3, TO_DATE('15-JAN-2022', 'dd-MON-yyyy'), 41.59),
	(4, 2, TO_DATE('16-JAN-2022', 'dd-MON-yyyy'), 40),
	(4, 5, TO_DATE('17-JAN-2022', 'dd-MON-yyyy'), 37.90);
