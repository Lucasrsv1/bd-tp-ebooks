import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { IAutor } from "src/app/interfaces/autor";

import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class AuthorsService {
	constructor (private readonly http: HttpClient) { }

	public getAll (): Observable<IAutor[]> {
		return this.http.get<IAutor[]>(`${environment.API_URL}/v1/autores`);
	}

	public create (nome: string): Observable<IAutor> {
		return this.http.post<IAutor>(`${environment.API_URL}/v1/autores`, { nome });
	}

	public edit (idAutor: number, nome: string): Observable<IAutor> {
		return this.http.put<IAutor>(`${environment.API_URL}/v1/autores`, { idAutor, nome });
	}

	public remove (idAutor: number): Observable<number> {
		return this.http.delete<number>(`${environment.API_URL}/v1/autores/${idAutor}`);
	}
}
