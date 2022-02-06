import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { finalize } from "rxjs/operators";
import { Subject } from "rxjs";
import { BlockUI, NgBlockUI } from "ng-block-ui";

import { IVenda } from "src/app/interfaces/venda";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { SalesService } from "src/app/services/sales/sales.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-vendas",
	templateUrl: "./vendas.component.html",
	styleUrls: ["./vendas.component.scss"]
})
export class VendasComponent implements OnInit, OnDestroy, AfterViewInit {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable?: DataTableDirective;

	public sales: IVenda[] = [];

	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	constructor (
		private readonly alertsService: AlertsService,
		private readonly salesService: SalesService,
		private readonly utilsService: UtilsService
	) {
		this.dtOptions = {
			stateSave: true,
			language: this.utilsService.getDataTablesTranslation("Nenhuma venda cadastrada")
		};
	}

	public ngOnInit (): void {
		this.blockUI?.start("Carregando vendas...");
		this.getAll();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
	  this.dtTrigger.unsubscribe();
	}

	public getAll (): void {
		this.salesService.getAll()
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				sales => {
					this.sales = sales;
					this.rerenderDatatables();
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Obter as Vendas",
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
}
