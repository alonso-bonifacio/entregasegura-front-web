import { Component } from '@angular/core';
import { Usuario } from 'src/app/Interfaces/usuario';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  usuarioLocal: any;
  usuario: Usuario = <Usuario>{};
  constructor(){
    this.usuarioLocal = localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.usuarioLocal);
  }



}
