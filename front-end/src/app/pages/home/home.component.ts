import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { EbooksService } from "src/app/services/ebooks/ebooks.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy {

	protected _onDestroy = new Subject<void>();
	ebooks: any = [];

	constructor (
		private readonly ebooksService: EbooksService,
		private readonly alertsService: AlertsService
	) { }

	ngOnInit (): void {
		this.ebooksService.getAll().pipe(
			takeUntil(this._onDestroy)
		).subscribe((res) => {
			this.ebooks = res;
		}, (error) => {
			this.alertsService.httpErrorAlert(
				"Erro ao Obter Ebooks",
				"Não foi possível realizar a consulta, tente novamente.",
				error
			);
		});
	}

	ngOnDestroy (): void {
		this._onDestroy.next();
		this._onDestroy.complete();
	}

}
