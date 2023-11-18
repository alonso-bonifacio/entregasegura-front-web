import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Trabajador } from '../Interfaces/trabajador';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrabajadorService {
  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'trabajador';

  constructor(private http: HttpClient) {}

  listar(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(`${this.apiUrl}/listar`);
  }

  guardar(trabajador: Trabajador): Observable<Trabajador> {
    return this.http.post<Trabajador>(`${this.apiUrl}/guardar`, trabajador);
  }

  actualizar(idTrabajador: number, trabajador: Trabajador): Observable<Trabajador> {
    return this.http.put<Trabajador>(
      `${this.apiUrl}/actualizar/${idTrabajador}`,
      trabajador
    );
  }

  eliminar(idCliente: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${idCliente}`);
  }
}
