import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BlockUIModule } from "ng-block-ui";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { EbookComponent } from "./ebook/ebook.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { VisualValidatorComponent } from "./visual-validator/visual-validator.component";

@NgModule({
	declarations: [
		EbookComponent,
		FileUploadComponent,
		FooterComponent,
		HeaderComponent,
		VisualValidatorComponent
	],
	imports: [
		BrowserModule,
		RouterModule,
		BlockUIModule.forRoot(),
		CollapseModule.forRoot(),
		BrowserAnimationsModule,
		FontAwesomeModule
	],
	exports: [
		EbookComponent,
		FileUploadComponent,
		FooterComponent,
		HeaderComponent,
		VisualValidatorComponent
	]
})
export class ComponentsModule { }
