import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { BlockUI, NgBlockUI } from "ng-block-ui";

import { IValidations } from "src/app/components/visual-validator/visual-validator.component";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";

@Component({
	selector: "app-perfil",
	templateUrl: "./perfil.component.html",
	styleUrls: ["./perfil.component.scss"]
})
export class PerfilComponent {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild("nomeInput")
	private nomeInput?: ElementRef;

	public form: FormGroup;
	public validations: IValidations;

	constructor (
		private readonly formBuilder: FormBuilder,
		private readonly authenticationService: AuthenticationService,
		private readonly alertsService: AlertsService
	) {
		this.form = this.formBuilder.group({
			nome: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			senha: ["", Validators.required],
			senhaNova: ["", Validators.required]
		});

		this.validations = {
			form: this.form,
			fields: {
				nome: [{ key: "required" }],
				email: [{ key: "required" }, { key: "email" }],
				senha: [{ key: "required" }],
				senhaNova: [{ key: "required" }]
			}
		};

	}

	public atualizar (): void {

		if (this.form.invalid)
			return this.alertsService.show("Atenção", "Algum campo está invalido.", "error");

		if (this.blockUI)
			this.blockUI.start("Atualizando Cadastro...");

		// TODO: Implementar o método de atualização do cadastro.
	}

	public clear (): void {
		this.form.reset();
		if (this.nomeInput)
			this.nomeInput.nativeElement.focus();
	}

}
