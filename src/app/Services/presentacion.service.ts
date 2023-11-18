import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Presentacion } from '../Interfaces/presentacion';


@Injectable({
  providedIn: 'root',
})
export class PresentacionService {

  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'presentacion';

  constructor(private http: HttpClient) {}

  listar(): Observable<Presentacion[]> {
    return this.http.get<Presentacion[]>(`${this.apiUrl}/listar`);
  }
}
