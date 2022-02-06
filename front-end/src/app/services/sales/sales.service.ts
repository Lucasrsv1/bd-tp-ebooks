import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class SalesService {
	constructor (private readonly http: HttpClient) { }

	public getAll () {
		return this.http.get<any>(`${environment.API_URL}/v1/vendas`);
	}

}
