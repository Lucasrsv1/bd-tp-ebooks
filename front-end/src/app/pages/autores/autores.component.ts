import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { faBook, faPencilAlt, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { IAutor } from "src/app/interfaces/autor";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { AuthorsService } from "src/app/services/authors/authors.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-autores",
	templateUrl: "./autores.component.html",
	styleUrls: ["./autores.component.scss"]
})
export class AutoresComponent implements OnInit, AfterViewInit, OnDestroy {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable?: DataTableDirective;

	public authors: IAutor[] = [];

	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	public faBook = faBook;
	public faPencilAlt = faPencilAlt;
	public faTrashAlt = faTrashAlt;
	public faPlus = faPlus;

	constructor (
		private readonly alertsService: AlertsService,
		private readonly authorsService: AuthorsService,
		private readonly utilsService: UtilsService
	) {
		this.dtOptions = {
			stateSave: true,
			language: this.utilsService.getDataTablesTranslation("Nenhum autor cadastrado")
		};
	}

	public ngOnInit (): void {
		this.blockUI?.start("Carregando autores...");
		this.getAuthors();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
	  this.dtTrigger.unsubscribe();
	}

	public getAuthors (): void {
		this.authorsService.getAll().subscribe(
			authors => {
				this.blockUI?.stop();
				this.authors = authors;
				this.rerenderDatatables();
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Obter Autores",
					"Não foi possível realizar a consulta, tente novamente.",
					error
				);
			}
		);
	}

	public rerenderDatatables (): void {
		this.dataTable?.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this.dtTrigger.next();
		});
	}

	public listBooks (author: IAutor): void { }

	public create (): void { }

	public edit (author: IAutor): void { }

	public remove (author: IAutor): void { }
}
