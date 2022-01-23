import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import localePt from "@angular/common/locales/pt";
import { registerLocaleData } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";

import { BlockUIModule } from "ng-block-ui";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { DataTablesModule } from "angular-datatables";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ModalModule } from "ngx-bootstrap/modal";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxCurrencyModule } from "ngx-currency";
import { defineLocale, ptBrLocale } from "ngx-bootstrap/chronos";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";

import { RequestInterceptor } from "./services/authentication/request.interceptor";

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

defineLocale("pt-br", ptBrLocale);
registerLocaleData(localePt);

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		LoginComponent,
		MinhasComprasComponent,
		AutoresComponent,
		GenerosComponent,
		EbooksComponent,
		VendasComponent,
		PerfilComponent,
		CadastroComponent,
		FuncionariosComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FontAwesomeModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		DataTablesModule,
		BlockUIModule,
		NgSelectModule,
		ComponentsModule,
		CarouselModule.forRoot(),
		NgxCurrencyModule,
		ModalModule.forRoot(),
		BsDatepickerModule.forRoot(),
		BrowserAnimationsModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
		{ provide: LOCALE_ID, useValue: "pt-BR" }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
