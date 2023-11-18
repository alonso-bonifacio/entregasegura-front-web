import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UnidadesMedida } from '../Interfaces/unidades-medida';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadesMedidaService {

  private endpoint:string = environment.endPoint;
  private apiUrl:string = this.endpoint+"undmedida";

  constructor(private http:HttpClient) { }

  listar():Observable<UnidadesMedida[]>{
    return this.http.get<UnidadesMedida[]>(`${this.apiUrl}/listar`);
  }
}
