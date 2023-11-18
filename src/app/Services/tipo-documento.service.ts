import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import { environment } from "src/environments/environment";
import {Observable} from 'rxjs';
import { TipoDocumento } from "../Interfaces/tipo-documento";

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  private endpoint:string = environment.endPoint;
  private apiUrl:string=this.endpoint+"tpodocumento";

  constructor(private http:HttpClient) {}

    listar():Observable<TipoDocumento[]>{
      return this.http.get<TipoDocumento[]>(`${this.apiUrl}/listar`)
    }


}
