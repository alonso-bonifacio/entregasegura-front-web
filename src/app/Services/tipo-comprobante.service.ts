import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TipoComprobante } from '../Interfaces/tipo-comprobante';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TipoComprobanteService {
  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'tpocomprobante';

  constructor(private http: HttpClient) {}

  listar(): Observable<TipoComprobante[]> {
    return this.http.get<TipoComprobante[]>(`${this.apiUrl}/listar`);
  }
}
