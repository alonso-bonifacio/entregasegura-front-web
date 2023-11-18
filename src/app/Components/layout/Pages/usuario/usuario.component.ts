import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Rol } from 'src/app/Interfaces/rol';
import { Trabajador } from 'src/app/Interfaces/trabajador';
import { Usuario } from 'src/app/Interfaces/usuario';
import { RolService } from 'src/app/Services/rol.service';
import { TrabajadorService } from 'src/app/Services/trabajador.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  titulosTabla: string[] = [
    'N°',
    'Apellidos y Nombre',
    'Rol',
    'Correo',
    'Opciones',
  ];
  listaUsuarios: Usuario[] = [];
  listaTrabajadores: Trabajador[] = [];
  listaRoles: Rol[] = [];

  formularioUsuario: FormGroup;
  tituloAccion: string = 'Nuevo Usuario';
  botonAccion: string = 'Guardar';
  usuarioActual: Usuario = <Usuario>{};

  usuarioLocal: any;
  usuario: Usuario = <Usuario>{};

  constructor(
    private fb: FormBuilder,
    private usuarioServicio: UsuarioService,
    private trabajadorServicio: TrabajadorService,
    private rolServicio: RolService
  ) {
    this.usuarioLocal = localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.usuarioLocal);
    this.trabajadorServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaTrabajadores = data;
      },
      error: (e) => {},
    });

    this.rolServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaRoles = data;
      },
      error: (e) => {},
    });

    this.formularioUsuario = this.fb.group({
      idTrabajador: ['', Validators.required],
      contrasena: ['', Validators.required],
      idRol: ['', Validators.required],
      gestionProveedor: [''],
      gestionProducto: [''],
      gestionCategoria: [''],
      gestionCliente: [''],
      gestionTrabajador: [''],
      gestionIngreso: [''],
      gestionUsuario: [''],
    });
  }

  obtenerUsuarios() {
    this.usuarioServicio.listar().subscribe({
      next: (data) => {
        if (data) {
          this.listaUsuarios = data;
        } else {
          Swal.fire({
            title: 'No se encontraron datos',
            timer: 2000,
            icon: 'warning',
          });
        }
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino !== '') {
      this.listaUsuarios = this.buscarUsuarios(termino);
    } else {
      this.obtenerUsuarios();
    }
  }

  buscarUsuarios(termino: string): Usuario[] {
    let usuariosArr: Usuario[] = [];
    termino = termino.toLowerCase();

    for (const usuario of this.listaUsuarios) {
      let nombre = usuario.apellidoTrabajador.toLowerCase();
      if (nombre.indexOf(termino) >= 0) {
        usuariosArr.push(usuario);
      }
    }

    return usuariosArr;
  }

  crear() {
    this.tituloAccion = 'Nuevo Usuario';
    this.botonAccion = 'Guardar';
    this.usuarioActual = <Usuario>{};
    this.formularioUsuario.reset();
  }

  editar(usuario: Usuario) {
    this.tituloAccion = 'Editar Usuario';
    this.botonAccion = 'Actualizar';
    this.usuarioActual = usuario;

    this.formularioUsuario.controls['idTrabajador'].setValue(
      usuario.idTrabajador
    );
    this.formularioUsuario.controls['contrasena'].setValue(usuario.contrasena);
    this.formularioUsuario.controls['idRol'].setValue(usuario.idRol);
    this.formularioUsuario.controls['gestionProveedor'].setValue(
      usuario.gestionProveedor
    );
    this.formularioUsuario.controls['gestionProducto'].setValue(
      usuario.gestionProducto
    );
    this.formularioUsuario.controls['gestionCategoria'].setValue(
      usuario.gestionCategoria
    );
    this.formularioUsuario.controls['gestionCliente'].setValue(
      usuario.gestionCliente
    );
    this.formularioUsuario.controls['gestionTrabajador'].setValue(
      usuario.gestionTrabajador
    );
    this.formularioUsuario.controls['gestionIngreso'].setValue(
      usuario.gestionIngreso
    );
    this.formularioUsuario.controls['gestionUsuario'].setValue(
      usuario.gestionUsuario
    );

    /*this.formularioUsuario.controls['nombre'].setValue(categoria.nombre);
    this.formularioUsuario.controls['descripcion'].setValue(
      categoria.descripcion
    );*/
  }

  guardar() {
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading(null);

    let peticion: Observable<any>;
    let { idUsuario } = this.usuarioActual;
    this.usuarioActual = { idUsuario, ...this.formularioUsuario.value };
    console.log(this.usuarioActual);

    if (this.usuarioActual.idUsuario) {
      peticion = this.usuarioServicio.actualizar(
        this.usuarioActual.idUsuario,
        this.usuarioActual
      );
      console.log('Se actualiza');
      console.log(this.usuarioActual);
    } else {
      peticion = this.usuarioServicio.guardar(this.formularioUsuario.value);
      console.log('Se guarda');
      console.log(this.usuarioActual);
    }

    peticion.subscribe((resp) => {
      if (resp) {
        Swal.fire({
          title: 'El usuario fue procesado',
          timer: 2000,
          icon: 'success',
        });
        this.obtenerUsuarios();
        this.usuarioActual = <Usuario>{};
        this.formularioUsuario.reset();
      } else {
        Swal.fire({
          title: 'No se pudo procesar el usuario',
          timer: 2000,
          icon: 'error',
        });
      }
    });
  }

  eliminar(usuario: Usuario) {
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: usuario.apellidoTrabajador + ', ' + usuario.nombreTrabajador,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next: () => {
            Swal.fire({
              title: 'El Usuario fue eliminado',
              timer: 1000,
              icon: 'success',
            });
            this.obtenerUsuarios();
          },
          error: (e) => {},
        });
      }
    });
  }

  ocultarMostrar() {
    let el: any = document.getElementById('wrapper');
    el.classList.toggle('toggled');
  }
}
