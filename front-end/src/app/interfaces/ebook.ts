export interface IEbook {
	idEbook: number;
	titulo: string;
	numPaginas: number;
	preco: number;
	sinopse: string;
	anoPublicacao: number;
	downloads: number;
	capa: string | null;
	autor: string;
	genero:	string;
	idAutor: number;
	idGenero: number;
	qtdCompradores: number;
	receita?: number;
}
