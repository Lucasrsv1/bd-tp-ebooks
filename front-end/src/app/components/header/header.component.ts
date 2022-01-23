import { Component } from "@angular/core";
import { Location } from "@angular/common";

import {
	faBars,
	faBook,
	faBookOpen,
	faBookReader,
	faSearchDollar,
	faShoppingBag,
	faSignInAlt,
	faSignOutAlt,
	faTools,
	faUserCircle,
	faUserEdit,
	faUsers
} from "@fortawesome/free-solid-svg-icons";

import { IUsuario } from "src/app/interfaces/usuario";

import { AuthenticationService } from "src/app/services/authentication/authentication.service";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
	public faBars = faBars;
	public faBook = faBook;
	public faBookOpen = faBookOpen;
	public faBookReader = faBookReader;
	public faSearchDollar = faSearchDollar;
	public faShoppingBag = faShoppingBag;
	public faSignInAlt = faSignInAlt;
	public faSignOutAlt = faSignOutAlt;
	public faTools = faTools;
	public faUserCircle = faUserCircle;
	public faUserEdit = faUserEdit;
	public faUsers = faUsers;

	public username: string = "";
	public isEmployee: boolean = false;

	public restrictedArea: boolean = false;
	public isMenuCollapsed: boolean = true;

	private restrictedURLs = [
		"/autores",
		"/generos",
		"/ebooks",
		"/vendas",
		"/funcionarios"
	];

	constructor (
		private readonly location: Location,
		private readonly authenticationService: AuthenticationService
	) {
		// Monitora login e logout
		this.authenticationService.$loggedClient.subscribe(user => {
			this.getUserInfo(user);
		});

		this.getUserInfo(this.authenticationService.getLoggedUser());
		this.location.onUrlChange(url => {
			this.restrictedArea = this.restrictedURLs.includes(url.split("?")[0]);
		});
	}

	public get isLoggedIn (): boolean {
		return this.authenticationService.isLoggedIn();
	}

	public logout (): void {
		this.authenticationService.signOut();
	}

	private getUserInfo (user: IUsuario | null): void {
		if (user) {
			const nomes = user.nome.split(" ");
			this.username = nomes.filter((_, idx) => idx === 0 || idx === nomes.length - 1).join(" ");
			this.isEmployee = !!user.funcionario;
		}
	}
}
