import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class WorkersService {
	constructor (private readonly http: HttpClient) { }

	public getAll () {
		return this.http.get<any>(`${environment.API_URL}/v1/funcionarios`);
	}

	public create (data: any): Observable<any> {
		return this.http.post<any>(`${environment.API_URL}/v1/funcionarios`, data);
	}

	public edit (data: any): Observable<any> {
		return this.http.put<any>(`${environment.API_URL}/v1/funcionarios`, data);
	}

	public remove (idFuncionario: number): Observable<number> {
		return this.http.delete<number>(`${environment.API_URL}/v1/funcionarios/${idFuncionario}`);
	}

}
