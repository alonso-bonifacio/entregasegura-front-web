import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ingreso } from '../Interfaces/ingreso';

@Injectable({
  providedIn: 'root',
})
export class IngresoService {
  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'ingreso';

  constructor(private http: HttpClient) {}

  listar(): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(`${this.apiUrl}/listar`);
  }

  guardar(ingreso: Ingreso): Observable<Ingreso> {
    return this.http.post<Ingreso>(`${this.apiUrl}/guardar`, ingreso);
  }

  eliminar(idIngreso: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${idIngreso}`);
  }
}
