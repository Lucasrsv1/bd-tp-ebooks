
import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DataTableDirective } from "angular-datatables";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faBook, faPencilAlt, faPlus, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Observable, Subject, Subscription } from "rxjs";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { AuthorsService } from "src/app/services/authors/authors.service";
import { debounceTime, finalize } from "rxjs/operators";

import { IAutor } from "src/app/interfaces/autor";
import { IEbook } from "src/app/interfaces/ebook";
import { IGenero } from "src/app/interfaces/genero";
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";

import { EbooksService } from "src/app/services/ebooks/ebooks.service";
import { GenresService } from "src/app/services/genres/genres.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-ebooks",
	templateUrl: "./ebooks.component.html",
	styleUrls: ["./ebooks.component.scss"]
})
export class EbooksComponent implements OnInit, OnDestroy, AfterViewInit {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable?: DataTableDirective;

	@ViewChild("modal", { static: true })
	private modal!: TemplateRef<any>;

	@ViewChild("synopsisModal", { static: true })
	private synopsisModal!: TemplateRef<any>;

	public form: FormGroup;
	public validations: IValidations;
	public modalRef?: BsModalRef;

	public minReceita: number = 0;
	public minReceita$: Subject<number> = new Subject();

	public editando: IEbook | null = null;
	public selectedEbook: IEbook | null = null;
	public generos: IGenero[] = [];
	public autores: IAutor[] = [];
	public ebooks: IEbook[] = [];

	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	public faBook = faBook;
	public faPencilAlt = faPencilAlt;
	public faPlus = faPlus;
	public faSave = faSave;
	public faTrashAlt = faTrashAlt;

	private subscriptions: Subscription[] = [];

	constructor (
		private readonly modalService: BsModalService,
		private readonly formBuilder: FormBuilder,
		private readonly alertsService: AlertsService,
		private readonly authorsService: AuthorsService,
		private readonly genresService: GenresService,
		private readonly ebooksService: EbooksService,
		private readonly utilsService: UtilsService
	) {
		this.dtOptions = {
			stateSave: true,
			columnDefs: [{ targets: 10, orderable: false }],
			language: this.utilsService.getDataTablesTranslation("Nenhum gênero cadastrado")
		};

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
		this.subscriptions.push(this.modalService.onHide.subscribe(() => this.editando = null));

		// Monitora mudanças no filtro de receita mínima
		this.subscriptions.push(this.minReceita$.pipe(debounceTime(500)).subscribe(this.getAll.bind(this)));
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

		this.genresService.getAll()
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				genders => {
					this.generos = genders;
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Obter Autores",
						"Não foi possível realizar a consulta, tente novamente.",
						error
					);
				}
			);
		this.getAll();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
		this.dtTrigger.unsubscribe();
		for (const subscription of this.subscriptions)
			subscription.unsubscribe();
	}

	public getAll (): void {
		this.ebooksService.getAll(this.minReceita)
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				ebooks => {
					this.ebooks = ebooks;
					this.rerenderDatatables();
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Obter Ebooks",
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
		this.form.get("anoPublicacao")?.setValue((new Date()).getFullYear());
		$("#titulo").trigger("focus");
	}

	public create (): void {
		this.editando = null;
		this.modalRef = this.modalService.show(this.modal, { class: "modal-lg" });
		this.clear();
	}

	public showSynopsis (ebook: IEbook): void {
		this.selectedEbook = ebook;
		this.modalRef = this.modalService.show(this.synopsisModal);
	}

	public edit (ebook: IEbook): void {
		this.editando = ebook;
		this.modalRef = this.modalService.show(this.modal, { class: "modal-lg" });
		this.clear();
		this.form.get("titulo")?.setValue(ebook.titulo);
		this.form.get("anoPublicacao")?.setValue(ebook.anoPublicacao);
		this.form.get("numPaginas")?.setValue(ebook.numPaginas);
		this.form.get("preco")?.setValue(ebook.preco);
		this.form.get("sinopse")?.setValue(ebook.sinopse);
		this.form.get("genero")?.setValue(ebook.idGenero);
		this.form.get("autor")?.setValue(ebook.idAutor);
		$("#titulo").trigger("focus");
	}

	public save (): void {
		if (this.form.invalid) {
			return this.alertsService.show(
				"Formulário Inválido!",
				"O preenchimento do formulário não é válido.",
				"error"
			);
		}

		this.blockUI?.start("Salvando ebook...");
		let ebook$: Observable<IEbook>;

		const data: any = {
			titulo: this.form.get("titulo")?.value,
			anoPublicacao: this.form.get("anoPublicacao")?.value,
			numPaginas: this.form.get("numPaginas")?.value,
			preco: this.form.get("preco")?.value,
			sinopse: this.form.get("sinopse")?.value,
			capa: null,
			idGenero: this.form.get("genero")?.value,
			idAutor: this.form.get("autor")?.value
		};

		if (this.editando) {
			data.idEbook = this.editando.idEbook;
			ebook$ = this.ebooksService.edit(data);
		} else {
			ebook$ = this.ebooksService.create(data);
		}

		ebook$
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				_ => {
					this.modalRef?.hide();

					this.getAll();
					this.alertsService.show(
						"Ebook Salvo",
						"O ebook foi salvo com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Salvar Ebook",
						"Não foi possível registrar os dados, tente novamente.",
						error
					);
				}
			);
	}

	public async remove (ebook: IEbook): Promise<void> {
		const confirmed = await this.alertsService.confirm(
			`Tem certeza de que deseja remover o ebook '${ebook.titulo}'?`
		);

		if (!confirmed) return;

		this.ebooksService.remove(ebook.idEbook)
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				_ => {
					this.ebooks = this.ebooks.filter(a => a.idEbook !== ebook.idEbook);
					this.rerenderDatatables();
					this.alertsService.show(
						"Ebook Removido",
						"O ebook foi removido com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Deletar Ebook",
						"Não foi possível deletar o ebook, tente novamente.",
						error
					);
				}
			);
	}

}
