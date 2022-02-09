import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IVenda } from "src/app/interfaces/venda";

import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class SalesService {
	constructor (private readonly http: HttpClient) { }

	public getAll (): Observable<IVenda[]> {
		return this.http.get<IVenda[]>(`${environment.API_URL}/v1/vendas`);
	}

	public getMyPurchases (): Observable<IVenda[]> {
		return this.http.get<IVenda[]>(`${environment.API_URL}/v1/vendas/usuario`);
	}

	public buy (idEbook: number, preco: number): Observable<boolean> {
		return this.http.post<boolean>(`${environment.API_URL}/v1/vendas`, { idEbook, preco });
	}
}
