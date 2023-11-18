import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Interfaces/cliente';
import { TipoDocumento } from 'src/app/Interfaces/tipo-documento';
import { Usuario } from 'src/app/Interfaces/usuario';
import { ClienteService } from 'src/app/Services/cliente.service';
import { TipoDocumentoService } from 'src/app/Services/tipo-documento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
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

  listaClientes: Cliente[] = [];

  formularioCliente: FormGroup;
  tituloAccion: string = 'Nuevo Cliente';
  botonAccion: string = 'Guardar';
  listaTpoDocumento: TipoDocumento[] = [];
  clienteActual: Cliente = <Cliente>{};

  usuarioLocal: any;
  usuario: Usuario = <Usuario>{};

  constructor(
    private fb: FormBuilder,
    private clienteServicio: ClienteService,
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

    this.clienteServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaClientes = data;
      },
      error: (e) => {},
    });

    this.formularioCliente = this.fb.group({
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

  obtenerClientes() {
    this.clienteServicio.listar().subscribe({
      next: (data) => {
        if (data) {
          this.listaClientes = data;
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
    this.obtenerClientes();
  }

  buscarClientes(termino: string): Cliente[] {
    let clientesArr: Cliente[] = [];
    termino = termino.toLowerCase();

    for (const cliente of this.listaClientes) {
      let nombre = cliente.nombre.toLowerCase();
      if (nombre.indexOf(termino) >= 0) {
        clientesArr.push(cliente);
      }
    }

    return clientesArr;
  }

  buscarCliente(termino: string) {
    if (termino !== '') {
      this.listaClientes = this.buscarClientes(termino);
    } else {
      this.obtenerClientes();
    }
  }

  crear() {
    this.tituloAccion = 'Nuevo Cliente';
    this.botonAccion = 'Guardar';
    this.clienteActual = <Cliente>{};
    this.formularioCliente.reset();
  }

  editar(cliente: Cliente) {
    this.tituloAccion = 'Editar Cliente';
    this.botonAccion = 'Actualizar';
    this.clienteActual = cliente;

    this.formularioCliente.controls['nombre'].setValue(cliente.nombre);
    this.formularioCliente.controls['apellido'].setValue(cliente.apellido);
    this.formularioCliente.controls['sexo'].setValue(cliente.sexo);
    this.formularioCliente.controls['fechaNacimiento'].setValue(
      cliente.fechaNacimiento
    );
    this.formularioCliente.controls['idTipoDocumento'].setValue(
      cliente.idTipoDocumento
    );
    this.formularioCliente.controls['numeroDocumento'].setValue(
      cliente.numeroDocumento
    );
    this.formularioCliente.controls['direccion'].setValue(cliente.direccion);
    this.formularioCliente.controls['telefonoFijo'].setValue(
      cliente.telefonoFijo
    );
    this.formularioCliente.controls['telefonoCelular'].setValue(
      cliente.telefonoCelular
    );
    this.formularioCliente.controls['email'].setValue(cliente.email);
    this.formularioCliente.controls['estado'].setValue(cliente.estado);
  }

  guardar() {
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false,
    });

    Swal.showLoading(null);

    let peticion: Observable<any>;
    let { idCliente } = this.clienteActual;
    this.clienteActual = { idCliente, ...this.formularioCliente.value };

    if (this.clienteActual.idCliente) {
      peticion = this.clienteServicio.actualizar(
        this.clienteActual.idCliente,
        this.clienteActual
      );
    } else {
      peticion = this.clienteServicio.guardar(this.formularioCliente.value);
    }

    peticion.subscribe((resp) => {
      if (resp) {
        Swal.fire({
          title: 'El cliente fue procesado',
          timer: 2000,
          icon: 'success',
        });
        this.obtenerClientes();
        this.clienteActual = <Cliente>{};
        this.formularioCliente.reset();
      } else {
        Swal.fire({
          title: 'No se pudo procesar el cliente',
          timer: 2000,
          icon: 'error',
        });
      }
    });
  }

  eliminar(cliente: Cliente) {
    Swal.fire({
      title: '¿Desea eliminar el cliente?',
      text: cliente.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.clienteServicio.eliminar(cliente.idCliente).subscribe({
          next: () => {
            Swal.fire({
              title: 'El cliente fue eliminado',
              timer: 1000,
              icon: 'success',
            });
            this.obtenerClientes();
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
