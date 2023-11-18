import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Producto } from '../Interfaces/producto';


@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'producto';

  constructor(private http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/listar`);
  }

  guardar(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/guardar`, producto);
  }

  actualizar(idProducto: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.apiUrl}/actualizar/${idProducto}`,
      producto
    );
  }

  eliminar(idProducto: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${idProducto}`);
  }
}
