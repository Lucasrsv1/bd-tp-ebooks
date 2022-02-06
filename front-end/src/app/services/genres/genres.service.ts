import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class GenresService {
	constructor (private readonly http: HttpClient) { }

	public getAll () {
		return this.http.get<any>(`${environment.API_URL}/v1/generos`);
	}

	public create (nome: string): Observable<any> {
		return this.http.post<any>(`${environment.API_URL}/v1/generos`, { nome });
	}

	public edit (idGenero: number, nome: string): Observable<any> {
		return this.http.put<any>(`${environment.API_URL}/v1/generos`, { idGenero, nome });
	}

	public remove (idGenero: number): Observable<number> {
		return this.http.delete<number>(`${environment.API_URL}/v1/generos/${idGenero}`);
	}

}
