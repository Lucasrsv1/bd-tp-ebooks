import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { BlockUI, NgBlockUI } from "ng-block-ui";

import { IValidations } from "src/app/components/visual-validator/visual-validator.component";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild("emailInput")
	private emailInput?: ElementRef;

	public form: FormGroup;
	public validations: IValidations;

	constructor (
		private readonly formBuilder: FormBuilder,
		private readonly authenticationService: AuthenticationService,
		private readonly alertsService: AlertsService
	) {
		this.form = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			senha: ["", Validators.required]
		});

		this.validations = {
			form: this.form,
			fields: {
				email: [{ key: "required" }, { key: "email" }],
				senha: [{ key: "required" }]
			}
		};
	}

	public login (): void {
		if (this.form.invalid)
			return this.alertsService.show("Atenção", "E-mail ou senha inválidos.", "error");

		if (this.blockUI)
			this.blockUI.start("Autenticando...");

		this.authenticationService.login(
			this.form.get("email")?.value,
			this.form.get("senha")?.value,
			this.blockUI
		);
	}

	public clear (): void {
		this.form.reset();
		if (this.emailInput)
			this.emailInput.nativeElement.focus();
	}
}
