import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { BlockUI, NgBlockUI } from "ng-block-ui";

import { IUsuario } from "src/app/interfaces/usuario";
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

	private originalUserData: IUsuario | null;

	constructor (
		private readonly formBuilder: FormBuilder,
		private readonly authenticationService: AuthenticationService,
		private readonly alertsService: AlertsService
	) {
		this.form = this.formBuilder.group({
			nome: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			novaSenha: [""]
		});

		this.validations = {
			form: this.form,
			fields: {
				nome: [{ key: "required" }],
				email: [
					{ key: "required" },
					{ key: "email" }
				],
				novaSenha: []
			}
		};

		this.originalUserData = this.authenticationService.getLoggedUser();
		this.form.get("nome")?.setValue(this.originalUserData?.nome);
		this.form.get("email")?.setValue(this.originalUserData?.email);
	}

	public get nothingIsChanged (): boolean {
		return Boolean(this.originalUserData && !this.form.get("novaSenha")?.value &&
			this.originalUserData.nome === this.form.get("nome")?.value &&
			this.originalUserData.email === this.form.get("email")?.value);
	}

	public atualizar (): void {
		if (this.form.invalid || this.nothingIsChanged)
			return this.alertsService.show("Atenção", "Algum campo está invalido.", "error");

		this.blockUI?.start("Atualizando Cadastro...");
		this.authenticationService.updateProfile(
			this.form.get("nome")?.value,
			this.form.get("email")?.value,
			this.form.get("novaSenha")?.value,
			this.blockUI
		);
	}

	public clear (): void {
		this.form.reset();
		if (this.nomeInput)
			this.nomeInput.nativeElement.focus();
	}
}
