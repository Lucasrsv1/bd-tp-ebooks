import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

import { finalize } from "rxjs/operators";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { faBook, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import { IEbook } from "src/app/interfaces/ebook";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { EbooksService } from "src/app/services/ebooks/ebooks.service";
import { SalesService } from "src/app/services/sales/sales.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
	@BlockUI()
	private blockUI?: NgBlockUI;

	public ebooks?: IEbook[];
	public faBook = faBook;
	public faShoppingCart = faShoppingCart;

	constructor (
		private readonly alertsService: AlertsService,
		private readonly ebooksService: EbooksService,
		private readonly salesService: SalesService
	) { }

	public ngOnInit (): void {
		this.ebooksService.getAll().subscribe(
			ebooks => this.ebooks = ebooks,
			(error) => {
				this.alertsService.httpErrorAlert(
					"Erro ao Obter Ebooks",
					"Não foi possível realizar a consulta, tente novamente.",
					error
				);
			}
		);
	}

	public async buy (ebook: IEbook): Promise<void> {
		const confirm = await this.alertsService.confirm(`Tem certeza de que deseja comprar o eBook ${ebook.titulo}?`, false);
		if (!confirm) return;

		this.blockUI?.start("Realizando compra...");
		this.salesService.buy(ebook.idEbook, ebook.preco)
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				_ => {
					this.alertsService.show(
						"Pedido Finalizado",
						"A compra do eBook foi realizada com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Fazer Pedido",
						"Não foi possível realizar a compra, tente novamente.",
						error
					);
				}
			);
	}
}
