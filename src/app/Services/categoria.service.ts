import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Categoria } from '../Interfaces/categoria';


@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'categoria';

  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/listar`);
  }

  guardar(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/guardar`, categoria);
  }

  actualizar(idCategoria: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(
      `${this.apiUrl}/actualizar/${idCategoria}`,
      categoria
    );
  }

  eliminar(idCategoria: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${idCategoria}`);
  }
}
