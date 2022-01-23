import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class UtilsService {
	constructor () { }

	public getDataTablesTranslation (emptyLabel: string = "Nenhum registro"): DataTables.LanguageSettings {
		return {
			emptyTable: emptyLabel,
			info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
			infoEmpty: "Mostrando 0 até 0 de 0 registros",
			infoFiltered: "(Filtrados de _MAX_ registros)",
			infoPostFix: "",
			thousands: ".",
			lengthMenu: "_MENU_ resultados por página",
			loadingRecords: "Carregando...",
			processing: "Processando...",
			zeroRecords: "Nenhum registro encontrado",
			search: "Pesquisar:",
			paginate: {
				next: "Próximo",
				previous: "Anterior",
				first: "Primeiro",
				last: "Último"
			},
			aria: {
				sortAscending: ": Ordenar colunas de forma ascendente",
				sortDescending: ": Ordenar colunas de forma descendente"
			}
		};
	}

	public createDateSortingType (): void {
		const jFn: any = jQuery.fn;
		jQuery.extend(jFn.dataTableExt.oSort, {
			"date-br-pre" (value: string): number {
				if (value == null || value == "")
					return 0;

				const brDate: string[] = value.split("/");
				return parseInt(brDate[2] + brDate[1] + brDate[0]);
			},

			"date-br-asc" (a: number, b: number) {
				return (a < b) ? -1 : ((a > b) ? 1 : 0);
			},

			"date-br-desc" (a: number, b: number) {
				return (a < b) ? 1 : ((a > b) ? -1 : 0);
			}
		});
	}
}
