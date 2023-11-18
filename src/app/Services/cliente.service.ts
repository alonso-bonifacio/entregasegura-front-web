import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../Interfaces/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'cliente';

  constructor(private http: HttpClient) {}

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/listar`);
  }

  guardar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/guardar`, cliente);
  }

  actualizar(idCliente: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.apiUrl}/actualizar/${idCliente}`,
      cliente
    );
  }

  eliminar(idCliente: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${idCliente}`);
  }
}
