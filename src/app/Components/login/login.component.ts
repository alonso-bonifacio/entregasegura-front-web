import { Component } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Sesion } from '../../Interfaces/sesion';
import { SesionService } from 'src/app/Services/sesion.service';
import { Usuario } from 'src/app/Interfaces/usuario';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  sesion: Sesion = <Sesion>{};
  usuario: Usuario = <Usuario>{};

  constructor(private router: Router, private sesionServicio: SesionService){
    localStorage.clear();
  }

  login(form: NgForm){

    if(form.invalid) {return;}

    Swal.fire({
      title: 'Espere',
      text: 'Procesando usuario',
      allowOutsideClick: false,
    });

    Swal.showLoading(null);

    console.log(this.sesion);
    console.log(form);
    this.sesionServicio.Login(this.sesion).subscribe({
      next: (data) => {
        Swal.close();
        this.usuario = data;
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        this.router.navigateByUrl('/menu');
      },
      error: (err) => {
        Swal.fire({
          title: 'El usuario no existe',
          icon: 'error',
        });
        form.resetForm();
      }
    });

  }
}
