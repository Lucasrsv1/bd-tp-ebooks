import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DataTableDirective } from "angular-datatables";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faBook, faPencilAlt, faPlus, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Observable, Subject, Subscription } from "rxjs";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { finalize } from "rxjs/operators";

import { IFuncionario } from "src/app/interfaces/funcionario";
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";

import { UtilsService } from "src/app/services/utils/utils.service";
import { WorkersService } from "src/app/services/workers/workers.service";


@Component({
	selector: "app-funcionarios",
	templateUrl: "./funcionarios.component.html",
	styleUrls: ["./funcionarios.component.scss"]
})
export class FuncionariosComponent implements OnInit, OnDestroy, AfterViewInit {

	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable?: DataTableDirective;

	@ViewChild("modal", { static: true })
	private modal!: TemplateRef<any>;

	public form: FormGroup;
	public validations: IValidations;
	public modalRef?: BsModalRef;

	public editando: IFuncionario | null = null;

	public workers: any[] = [];

	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	public faBook = faBook;
	public faPencilAlt = faPencilAlt;
	public faPlus = faPlus;
	public faSave = faSave;
	public faTrashAlt = faTrashAlt;

	private subscriptions: Subscription;

	constructor (
		private readonly alertsService: AlertsService,
		private readonly workersService: WorkersService,
		private readonly utilsService: UtilsService,
		private readonly modalService: BsModalService,
		private readonly formBuilder: FormBuilder
	) {

		this.dtOptions = {
			stateSave: true,
			language: this.utilsService.getDataTablesTranslation("Nenhum gênero cadastrado")
		};

		this.form = this.formBuilder.group({
			nome: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			senha: ["", Validators.required]
		});

		this.validations = {
			form: this.form,
			fields: {
				nome: [{ key: "required" }],
				email: [{ key: "required" }, { key: "email" }]
			}
		};

		// Sai do modo de edição se o modal for fechado
		this.subscriptions = this.modalService.onHide.subscribe(() => this.editando = null);

	}

	public ngOnInit (): void {
		this.getAll();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
	  this.dtTrigger.unsubscribe();
	}

	public getAll (): void {
		this.workersService.getAll()
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				workers => {
					this.workers = workers;
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
		this.form.get("senha")?.enable();
		this.form.reset();
		$("#nome").trigger("focus");
	}

	public create (): void {
		this.editando = null;
		this.modalRef = this.modalService.show(this.modal, { class: "modal-lg" });
		this.clear();
	}

	public edit (worker: IFuncionario): void {
		this.editando = worker;
		this.modalRef = this.modalService.show(this.modal, { class: "modal-lg" });
		this.clear();
		this.form.get("senha")?.disable();
		this.form.get("nome")?.setValue(worker.nome);
		this.form.get("email")?.setValue(worker.email);
		$("#nome").trigger("focus");
	}

	public save (): void {

		this.blockUI?.start("Salvando funcionario...");
		let worker$: Observable<IFuncionario>;

		const data: any = {
			nome: this.form.get("nome")?.value,
			email: this.form.get("email")?.value,
			senha: this.form.get("senha")?.value
		};

		if (this.editando) {
			data.idFuncionario = this.editando.idFuncionario;
			worker$ = this.workersService.edit(data);
		} else {
			worker$ = this.workersService.create(data);
		}

		worker$
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				_ => {
					this.modalRef?.hide();

					this.getAll();
					this.alertsService.show(
						"Funcionario Salvo",
						"O funcionario foi salvo com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Salvar Funcionario",
						"Não foi possível registrar os dados, tente novamente.",
						error
					);
				}
			);
	}

	public async remove (worker: IFuncionario): Promise<void> {
		const confirmed = await this.alertsService.confirm(
			`Tem certeza de que deseja remover o funcionario '${worker.nome}'?`
		);

		if (!confirmed) return;

		this.workersService.remove(worker.idFuncionario)
			.pipe(finalize(() => this.blockUI?.stop()))
			.subscribe(
				_ => {
					this.workers = this.workers.filter(a => a.idFuncionario !== worker.idFuncionario);
					this.rerenderDatatables();
					this.alertsService.show(
						"Funcionario Removido",
						"O funcionario foi removido com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Deletar Funcionario",
						"Não foi possível deletar o funcionario, tente novamente.",
						error
					);
				}
			);
	}

}
