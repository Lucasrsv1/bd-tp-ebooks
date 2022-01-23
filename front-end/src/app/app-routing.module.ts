import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthenticationGuard } from "./guards/authentication/authentication.guard";
import { EmployeeGuard } from "./guards/employee/employee.guard";
import { LoginGuard } from "./guards/login/login.guard";

import { AutoresComponent } from "./pages/autores/autores.component";
import { CadastroComponent } from "./pages/cadastro/cadastro.component";
import { EbooksComponent } from "./pages/ebooks/ebooks.component";
import { FuncionariosComponent } from "./pages/funcionarios/funcionarios.component";
import { GenerosComponent } from "./pages/generos/generos.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { MinhasComprasComponent } from "./pages/minhas-compras/minhas-compras.component";
import { PerfilComponent } from "./pages/perfil/perfil.component";
import { VendasComponent } from "./pages/vendas/vendas.component";

const routes: Routes = [
	// Public
	{ path: "login", component: LoginComponent, canActivate: [LoginGuard] },
	{ path: "cadastro", component: CadastroComponent, canActivate: [LoginGuard] },

	// Restricted
	{ path: "home", component: HomeComponent, canActivate: [AuthenticationGuard] },
	{ path: "minhasCompras", component: MinhasComprasComponent, canActivate: [AuthenticationGuard] },
	{ path: "perfil", component: PerfilComponent, canActivate: [AuthenticationGuard] },

	// Employees Only
	{ path: "autores", component: AutoresComponent, canActivate: [EmployeeGuard] },
	{ path: "ebooks", component: EbooksComponent, canActivate: [EmployeeGuard] },
	{ path: "funcionarios", component: FuncionariosComponent, canActivate: [EmployeeGuard] },
	{ path: "generos", component: GenerosComponent, canActivate: [EmployeeGuard] },
	{ path: "vendas", component: VendasComponent, canActivate: [EmployeeGuard] },

	// No match
	{ path: "**", redirectTo: "home" }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
