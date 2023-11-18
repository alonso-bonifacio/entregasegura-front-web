import { Component } from '@angular/core';
import { Usuario } from 'src/app/Interfaces/usuario';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  url: string = 'https://www.youtube.com/embed/w5EuuOSg6sg';
  usuarioLocal: any;
  usuario: Usuario = <Usuario>{};

  constructor(){
    this.usuarioLocal = localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.usuarioLocal);
  }

  ocultarMostrar() {
    let el: any = document.getElementById('wrapper');
    el.classList.toggle('toggled');
  }
}
