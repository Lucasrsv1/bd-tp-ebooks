import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DataTableDirective } from "angular-datatables";
import { finalize } from "rxjs/operators";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faBook, faPencilAlt, faPlus, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Observable, Subject, Subscription } from "rxjs";

import { IGenero } from "src/app/interfaces/genero";
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { GenresService } from "src/app/services/genres/genres.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-generos",
	templateUrl: "./generos.component.html",
	styleUrls: ["./generos.component.scss"]
})
export class GenerosComponent implements OnInit, AfterViewInit, OnDestroy {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable?: DataTableDirective;

	@ViewChild("modalGerenciamento", { static: true })
	private modal!: TemplateRef<any>;

	public form: FormGroup;
	public validations: IValidations;
	public modalRef?: BsModalRef

	public genres: IGenero[] = [];
	public editando: IGenero | null = null;

	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	public faBook = faBook;
	public faPencilAlt = faPencilAlt;
	public faPlus = faPlus;
	public faSave = faSave;
	public faTrashAlt = faTrashAlt;

	private subscriptions: Subscription;

	constructor (
		private readonly modalService: BsModalService,
		private readonly formBuilder: FormBuilder,
		private readonly alertsService: AlertsService,
		private readonly genresService: GenresService,
		private readonly utilsService: UtilsService
	) {
		this.dtOptions = {
			stateSave: true,
			language: this.utilsService.getDataTablesTranslation("Nenhum gênero cadastrado")
		};

		this.form = this.formBuilder.group({
			nome: ["", Validators.required]
		});

		this.validations = {
			form: this.form,
			fields: {
				nome: [{ key: "required" }]
			}
		};

		// Sai do modo de edição se o modal for fechado
		this.subscriptions = this.modalService.onHide.subscribe(() => this.editando = null);
	}

	public ngOnInit (): void {
		this.blockUI?.start("Carregando gêneros...");
		this.getAll();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
	  this.dtTrigger.unsubscribe();
	  this.subscriptions.unsubscribe();
	}

	public getAll (): void {
		this.genresService.getAll()
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				genres => {
					this.genres = genres;
					this.rerenderDatatables();
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Obter Gêneros",
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

	public clear (): void {
		this.form.reset();
		$("#nome").trigger("focus");
	}

	public create (): void {
		this.editando = null;
		this.modalRef = this.modalService.show(this.modal, { class: "modal-lg" });
		this.clear();
	}

	public edit (genres: IGenero): void {
		this.editando = genres;
		this.modalRef = this.modalService.show(this.modal, { class: "modal-lg" });
		this.clear();
		this.form.get("nome")?.setValue(genres.nome);
	}

	public save (): void {
		if (this.form.invalid) {
			return this.alertsService.show(
				"Formulário Inválido!",
				"O preenchimento do formulário não é válido.",
				"error"
			);
		}

		this.blockUI?.start("Salvando gênero...");
		let genres$: Observable<IGenero>;
		if (this.editando)
			genres$ = this.genresService.edit(this.editando.idGenero, this.form.get("nome")?.value);
		else
			genres$ = this.genresService.create(this.form.get("nome")?.value);

		genres$
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				_ => {
					this.modalRef?.hide();

					this.getAll();
					this.alertsService.show(
						"Gênero Salvo",
						"O gênero foi salvo com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Salvar Gênero",
						"Não foi possível registrar os dados, tente novamente.",
						error
					);
				}
			);
	}

	public async remove (genres: IGenero): Promise<void> {
		const confirmed = await this.alertsService.confirm(
			`Tem certeza de que deseja remover o gênero '${genres.nome}'?`
		);

		if (!confirmed) return;

		this.genresService.remove(genres.idGenero)
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				_ => {
					this.genres = this.genres.filter(a => a.idGenero !== genres.idGenero);
					this.rerenderDatatables();
					this.alertsService.show(
						"Gênero Removido",
						"O gênero foi removido com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Deletar Gênero",
						"Não foi possível deletar o gênero, tente novamente.",
						error
					);
				}
			);
	}
}
