-- 1) Validação de senha do usuário
CREATE OR REPLACE FUNCTION verifica_senha_minima()
RETURNS trigger
AS $$
BEGIN
	if length(new.senha) < 6 then
		raise exception 'Senha menor que 6 caracteres!';
	end if;
	return NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS senha_minima ON usuarios;
CREATE TRIGGER senha_minima
BEFORE INSERT OR UPDATE ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE verifica_senha_minima();


-- 2) Validação do ano de publicação, quantidade de páginas e do preço do ebook
CREATE OR REPLACE FUNCTION verifica_ebook()
RETURNS trigger
AS $$
BEGIN
	if new.num_paginas <= 0 then
		raise exception 'Ebook com menos de uma pagina!';
	elsif new.preco <= 0 then
		raise exception 'Ebook com preço menor ou igual a zero!';
	elsif new.ano_publicacao > date_part('year', current_date) then
		raise exception 'Ebook com ano de publicação maior que o ano atual!';
	end if;
	return NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS verifica_ebook ON ebooks;
CREATE TRIGGER verifica_ebook
BEFORE INSERT OR UPDATE ON ebooks
FOR EACH ROW
EXECUTE PROCEDURE verifica_ebook();


-- 3) Ao inserir uma venda, incrementa a quantidade de downloads do ebook
CREATE OR REPLACE FUNCTION incrementa_downloads()
RETURNS trigger
AS $$
BEGIN
	update ebooks set qtd_downloads = qtd_downloads + 1
		where new.id_ebook = id_ebook;
	return NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS incrementa_downloads ON vendas;
CREATE TRIGGER incrementa_downloads
AFTER INSERT ON vendas
FOR EACH ROW
EXECUTE PROCEDURE incrementa_downloads();


-- 4) Validação do preço pago na tabela vendas
CREATE OR REPLACE FUNCTION verifica_preco_pago()
RETURNS trigger
AS $$
BEGIN
	if new.preco_pago <= 0 then
		raise exception 'Venda com preço pago menor ou igual a zero';
	end if;
	return NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS verifica_preco_pago ON vendas;
CREATE TRIGGER verifica_preco_pago
BEFORE INSERT OR UPDATE ON vendas
FOR EACH ROW
EXECUTE PROCEDURE verifica_preco_pago();


-- 5) Validação de atualização de um usuário impedindo que seja alterada a coluna funcionario
CREATE OR REPLACE FUNCTION verifica_funcionario()
RETURNS trigger
AS $$
BEGIN
	if new.funcionario AND not old.funcionario then
		raise exception 'Não é possivel mudar de usuario para funcionario!';
	end if;
	return NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS verifica_funcionario ON usuarios;
CREATE TRIGGER verifica_funcionario
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE verifica_funcionario();
