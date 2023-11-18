import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sesion } from '../Interfaces/sesion';
import { Usuario } from '../Interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'usuario';

  constructor(private http: HttpClient) {}

  Login(sesion: Sesion): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, sesion);
  }
}
