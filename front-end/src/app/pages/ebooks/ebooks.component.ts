import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Subscription } from "rxjs";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

import { IAutor } from "src/app/interfaces/autor";
import { IGenero } from "src/app/interfaces/genero";
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { AuthorsService } from "src/app/services/authors/authors.service";
import { finalize } from "rxjs/operators";

@Component({
	selector: "app-ebooks",
	templateUrl: "./ebooks.component.html",
	styleUrls: ["./ebooks.component.scss"]
})
export class EbooksComponent implements OnInit, OnDestroy {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild("modal", { static: true })
	private modal!: TemplateRef<any>;

	public form: FormGroup;
	public validations: IValidations;
	public modalRef?: BsModalRef;

	public editando = null;
	public generos: IGenero[] = [];
	public autores: IAutor[] = [];

	public faPlus = faPlus;
	public faSave = faSave;

	private subscriptions: Subscription;

	constructor (
		private readonly modalService: BsModalService,
		private readonly formBuilder: FormBuilder,
		private readonly alertsService: AlertsService,
		private readonly authorsService: AuthorsService
	) {
		const currentYear = (new Date()).getFullYear();
		this.form = this.formBuilder.group({
			titulo: ["", Validators.required],
			anoPublicacao: [currentYear, [Validators.required, Validators.max(currentYear)]],
			numPaginas: [null, [Validators.required, Validators.min(1)]],
			preco: [null, [Validators.required, Validators.min(0.01)]],
			sinopse: [""],
			genero: [null, Validators.required],
			autor: [null, Validators.required]
		});

		this.validations = {
			form: this.form,
			fields: {
				titulo: [{ key: "required" }],
				anoPublicacao: [
					{ key: "required" },
					{ key: "max" }
				],
				numPaginas: [
					{ key: "required" },
					{ key: "min" }
				],
				preco: [
					{ key: "required" },
					{ key: "min" }
				],
				sinopse: [],
				genero: [{ key: "required" }],
				autor: [{ key: "required" }]
			}
		};

		// Sai do modo de edição se o modal for fechado
		this.subscriptions = this.modalService.onHide.subscribe(() => this.editando = null);
	}

	public ngOnInit (): void {
		this.blockUI?.start("Carregando dados iniciais...");
		this.authorsService.getAll()
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				authors => {
					this.autores = authors;
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Obter Autores",
						"Não foi possível realizar a consulta, tente novamente.",
						error
					);
				}
			);
	}

	public ngOnDestroy (): void {
		this.subscriptions.unsubscribe();
	}

	public clear (): void {
		this.form.reset();
		this.form.get("anoPublicacao")?.setValue((new Date()).getFullYear());
		$("#titulo").trigger("focus");
	}

	public create (): void {
		this.editando = null;
		this.modalRef = this.modalService.show(this.modal, { class: "modal-lg" });
		this.clear();
	}

	public save (): void { }
}
