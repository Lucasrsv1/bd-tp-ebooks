import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { IEbook } from "src/app/interfaces/ebook";

@Injectable({ providedIn: "root" })
export class EbooksService {
	constructor (private readonly http: HttpClient) { }

	public getAll (minReceita: number = 0) {
		return this.http.get<any>(`${environment.API_URL}/v1/ebooks`, { params: { minReceita } });
	}

	public create (data: Partial<IEbook>, image: File | null): Observable<Partial<IEbook>> {
		const formData = new FormData();
		for (const key in data) {
			if (data.hasOwnProperty(key) && key !== "capa")
				formData.append(key, (data as Record<string, any>)[key].toString());
		}

		if (image) {
			const fileName = `${Date.now()}${image.name.substring(image.name.lastIndexOf("."))}`;
			formData.append("file_name", fileName);
			formData.append("cover", image, fileName);
			formData.append("capa", fileName);
		}

		return this.http.post<Partial<IEbook>>(`${environment.API_URL}/v1/ebooks`, formData);
	}

	public edit (data: Partial<IEbook>): Observable<Partial<IEbook>> {
		return this.http.put<Partial<IEbook>>(`${environment.API_URL}/v1/ebooks`, data);
	}

	public remove (idEbook: number): Observable<number> {
		return this.http.delete<number>(`${environment.API_URL}/v1/ebooks/${idEbook}`);
	}
}
