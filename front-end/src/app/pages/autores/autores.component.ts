import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DataTableDirective } from "angular-datatables";
import { finalize } from "rxjs/operators";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faBook, faPencilAlt, faPlus, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Observable, Subject, Subscription } from "rxjs";

import { IAutor } from "src/app/interfaces/autor";
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";

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

	@ViewChild("modalGerenciamento", { static: true })
	private modal!: TemplateRef<any>;

	@ViewChild("modalLista", { static: true })
	private modalLista!: TemplateRef<any>;

	public form: FormGroup;
	public validations: IValidations;
	public modalRef?: BsModalRef

	public authors: IAutor[] = [];
	public editando: IAutor | null = null;
	public selectedAuthor: IAutor | null = null;

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
		private readonly authorsService: AuthorsService,
		private readonly utilsService: UtilsService
	) {
		this.dtOptions = {
			stateSave: true,
			columnDefs: [{ targets: 3, orderable: false }],
			language: this.utilsService.getDataTablesTranslation("Nenhum autor cadastrado")
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
		this.blockUI?.start("Carregando autores...");
		this.getAuthors();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
	  this.dtTrigger.unsubscribe();
	  this.subscriptions.unsubscribe();
	}

	public getAuthors (): void {
		this.authorsService.getAll()
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				authors => {
					this.authors = authors;
					this.rerenderDatatables();
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

	public listBooks (author: IAutor): void {
		this.selectedAuthor = author;
		this.modalRef = this.modalService.show(this.modalLista, { class: "modal-lg" });
	}

	public create (): void {
		this.editando = null;
		this.modalRef = this.modalService.show(this.modal, { class: "modal-lg" });
		this.clear();
	}

	public edit (author: IAutor): void {
		this.editando = author;
		this.modalRef = this.modalService.show(this.modal, { class: "modal-lg" });
		this.clear();
		this.form.get("nome")?.setValue(author.nome);
	}

	public save (): void {
		if (this.form.invalid) {
			return this.alertsService.show(
				"Formulário Inválido!",
				"O preenchimento do formulário não é válido.",
				"error"
			);
		}

		this.blockUI?.start("Salvando autor...");
		let author$: Observable<IAutor>;
		if (this.editando)
			author$ = this.authorsService.edit(this.editando.idAutor, this.form.get("nome")?.value);
		else
			author$ = this.authorsService.create(this.form.get("nome")?.value);

		author$
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				_ => {
					this.modalRef?.hide();

					this.getAuthors();
					this.alertsService.show(
						"Autor Salvo",
						"O autor foi salvo com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Salvar Autor",
						"Não foi possível registrar os dados, tente novamente.",
						error
					);
				}
			);
	}

	public async remove (author: IAutor): Promise<void> {
		const confirmed = await this.alertsService.confirm(
			`Tem certeza de que deseja remover o autor '${author.nome}'?`
		);

		if (!confirmed) return;

		this.authorsService.remove(author.idAutor)
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				_ => {
					this.authors = this.authors.filter(a => a.idAutor !== author.idAutor);
					this.rerenderDatatables();
					this.alertsService.show(
						"Autor Removido",
						"O autor foi removido com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Deletar Autor",
						"Não foi possível deletar o autor, tente novamente.",
						error
					);
				}
			);
	}
}
