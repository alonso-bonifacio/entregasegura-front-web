import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../Interfaces/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private endpoint: string = environment.endPoint;
  private apiUrl: string = this.endpoint + 'usuario';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/listar`);
  }

  guardar(usuario: Usuario): Observable<Usuario> {
    usuario.gestionProveedor = usuario.gestionProveedor ? 1 : 0;
    usuario.gestionProducto = usuario.gestionProducto ? 1 : 0;
    usuario.gestionCategoria = usuario.gestionCategoria ? 1 : 0;
    usuario.gestionCliente = usuario.gestionCliente ? 1 : 0;
    usuario.gestionTrabajador = usuario.gestionTrabajador ? 1 : 0;
    usuario.gestionIngreso = usuario.gestionIngreso ? 1 : 0;
    usuario.gestionUsuario = usuario.gestionUsuario ? 1 : 0;
    return this.http.post<Usuario>(`${this.apiUrl}/guardar`, usuario);
  }

  actualizar(idUsuario: number, usuario: Usuario): Observable<Usuario> {
    usuario.gestionProveedor = usuario.gestionProveedor ? 1 : 0;
    usuario.gestionProducto = usuario.gestionProducto ? 1 : 0;
    usuario.gestionCategoria = usuario.gestionCategoria ? 1 : 0;
    usuario.gestionCliente = usuario.gestionCliente ? 1 : 0;
    usuario.gestionTrabajador = usuario.gestionTrabajador ? 1 : 0;
    usuario.gestionIngreso = usuario.gestionIngreso ? 1 : 0;
    usuario.gestionUsuario = usuario.gestionUsuario ? 1 : 0;
    return this.http.put<Usuario>(
      `${this.apiUrl}/actualizar/${idUsuario}`,
      usuario
    );
  }

  eliminar(idUsuario: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${idUsuario}`);
  }
}
