import { Component, Input } from "@angular/core";

import { IEbook } from "src/app/interfaces/ebook";

import { environment } from "src/environments/environment";

@Component({
	selector: "app-ebook",
	templateUrl: "./ebook.component.html",
	styleUrls: ["./ebook.component.scss"]
})
export class EbookComponent {
	@Input()
	public ebook!: IEbook;

	constructor () { }

	public getPhotoURL (link: string): string {
		return `${environment.COVERS_URL}/${link}`;
	}
}
