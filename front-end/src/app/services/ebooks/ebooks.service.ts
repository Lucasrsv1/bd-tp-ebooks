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

	public create (data: any): Observable<IEbook> {
		return this.http.post<IEbook>(`${environment.API_URL}/v1/ebooks`, data);
	}

	public edit (data: any): Observable<IEbook> {
		return this.http.put<IEbook>(`${environment.API_URL}/v1/ebooks`, data);
	}

	public remove (idEbook: number): Observable<number> {
		return this.http.delete<number>(`${environment.API_URL}/v1/ebooks/${idEbook}`);
	}
}
