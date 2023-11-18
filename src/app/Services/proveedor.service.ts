import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Proveedor } from '../Interfaces/proveedor';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'proveedor';

  constructor(private http: HttpClient) {}

  listar(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/listar`);
  }

  guardar(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.apiUrl}/guardar`, proveedor);
  }

  actualizar(idProveedor: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(
      `${this.apiUrl}/actualizar/${idProveedor}`,
      proveedor
    );
  }

  eliminar(idProveedor: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${idProveedor}`);
  }
}
