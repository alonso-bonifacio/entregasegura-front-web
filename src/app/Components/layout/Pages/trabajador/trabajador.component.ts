import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TipoDocumento } from 'src/app/Interfaces/tipo-documento';
import { Trabajador } from 'src/app/Interfaces/trabajador';
import { Usuario } from 'src/app/Interfaces/usuario';
import { TipoDocumentoService } from 'src/app/Services/tipo-documento.service';
import { TrabajadorService } from 'src/app/Services/trabajador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.css'],
})
export class TrabajadorComponent implements OnInit {
  titulosTabla: string[] = [
    'N°',
    'Apellidos y Nombres',
    'T. Doc.',
    'N° Doc.',
    'Dirección',
    'Teléfono',
    'Email',
    'Estado',
    'Opciones',
  ];

  listaTrabajadores: Trabajador[] = [];

  formularioTrabajador: FormGroup;
  tituloAccion: string = 'Nuevo Trabajador';
  botonAccion: string = 'Guardar';
  listaTpoDocumento: TipoDocumento[] = [];
  trabajadorActual: Trabajador = <Trabajador>{};

  usuarioLocal: any;
  usuario: Usuario = <Usuario>{};

  constructor(
    private fb: FormBuilder,
    private trabajadorServicio: TrabajadorService,
    private tpoDocumentoServicio: TipoDocumentoService
  ) {
    this.usuarioLocal = localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.usuarioLocal);
    this.tpoDocumentoServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaTpoDocumento = data;
      },
      error: (e) => {},
    });

    this.trabajadorServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaTrabajadores = data;
      },
      error: (e) => {},
    });

    this.formularioTrabajador = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      idTipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      direccion: ['', Validators.required],
      telefonoFijo: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(9),
          Validators.minLength(9),
        ])
      ),
      telefonoCelular: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(9),
          Validators.minLength(9),
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      estado: ['', Validators.required],
    });
  }

  obtenerTrabajadores() {
    this.trabajadorServicio.listar().subscribe({
      next: (data) => {
        if (data) {
          this.listaTrabajadores = data;
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
    this.obtenerTrabajadores();
  }

  buscarTrabajadores(termino: string): Trabajador[] {
    let trabajadorsArr: Trabajador[] = [];
    termino = termino.toLowerCase();

    for (const trabajador of this.listaTrabajadores) {
      let nombre = trabajador.nombre.toLowerCase();
      if (nombre.indexOf(termino) >= 0) {
        trabajadorsArr.push(trabajador);
      }
    }

    return trabajadorsArr;
  }

  buscarTrabajador(termino: string) {
    if (termino !== '') {
      this.listaTrabajadores = this.buscarTrabajadores(termino);
    } else {
      this.obtenerTrabajadores();
    }
  }

  crear() {
    this.tituloAccion = 'Nuevo Trabajador';
    this.botonAccion = 'Guardar';
    this.trabajadorActual = <Trabajador>{};
    this.formularioTrabajador.reset();
  }

  editar(trabajador: Trabajador) {
    this.tituloAccion = 'Editar Trabajador';
    this.botonAccion = 'Actualizar';
    this.trabajadorActual = trabajador;

    this.formularioTrabajador.controls['nombre'].setValue(trabajador.nombre);
    this.formularioTrabajador.controls['apellido'].setValue(
      trabajador.apellido
    );
    this.formularioTrabajador.controls['sexo'].setValue(trabajador.sexo);
    this.formularioTrabajador.controls['fechaNacimiento'].setValue(
      trabajador.fechaNacimiento
    );
    this.formularioTrabajador.controls['idTipoDocumento'].setValue(
      trabajador.idTipoDocumento
    );
    this.formularioTrabajador.controls['numeroDocumento'].setValue(
      trabajador.numeroDocumento
    );
    this.formularioTrabajador.controls['direccion'].setValue(
      trabajador.direccion
    );
    this.formularioTrabajador.controls['telefonoFijo'].setValue(
      trabajador.telefonoFijo
    );
    this.formularioTrabajador.controls['telefonoCelular'].setValue(
      trabajador.telefonoCelular
    );
    this.formularioTrabajador.controls['email'].setValue(trabajador.email);
    this.formularioTrabajador.controls['estado'].setValue(trabajador.estado);
  }

  guardar() {
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false,
    });

    Swal.showLoading(null);

    let peticion: Observable<any>;
    let { idTrabajador } = this.trabajadorActual;
    this.trabajadorActual = {
      idTrabajador,
      ...this.formularioTrabajador.value,
    };

    if (this.trabajadorActual.idTrabajador) {
      peticion = this.trabajadorServicio.actualizar(
        this.trabajadorActual.idTrabajador,
        this.trabajadorActual
      );
    } else {
      peticion = this.trabajadorServicio.guardar(
        this.formularioTrabajador.value
      );
    }

    peticion.subscribe((resp) => {
      if (resp) {
        Swal.fire({
          title: 'El trabajador fue procesado',
          timer: 2000,
          icon: 'success',
        });
        this.obtenerTrabajadores();
        this.trabajadorActual = <Trabajador>{};
        this.formularioTrabajador.reset();
      } else {
        Swal.fire({
          title: 'No se pudo procesar el trabajador',
          timer: 2000,
          icon: 'error',
        });
      }
    });
  }

  eliminar(trabajador: Trabajador) {
    Swal.fire({
      title: '¿Desea eliminar el trabajador?',
      text: trabajador.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.trabajadorServicio.eliminar(trabajador.idTrabajador).subscribe({
          next: () => {
            Swal.fire({
              title: 'El trabajador fue eliminado',
              timer: 1000,
              icon: 'success',
            });
            this.obtenerTrabajadores();
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
