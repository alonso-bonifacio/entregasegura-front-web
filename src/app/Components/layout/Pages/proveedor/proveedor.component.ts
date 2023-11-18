import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Proveedor } from "src/app/Interfaces/proveedor";
import { ProveedorService } from 'src/app/Services/proveedor.service';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoDocumentoService } from 'src/app/Services/tipo-documento.service';
import { TipoDocumento } from 'src/app/Interfaces/tipo-documento';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/Interfaces/usuario';


@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnInit {
  titulosTabla: string[] = [
    '#',
    'Razón Social',
    'Tipo Documento',
    'Número Documento',
    'Dirección',
    'Teléfono',
    'Email',
    'Opciones',
  ];

  listaProveedores: Proveedor[] = [];

  formularioProveedor: FormGroup;
  tituloAccion: string = 'Nuevo Proveedor';
  botonAccion: string = 'Guardar';
  listaTiposDocumento: TipoDocumento[] = [];
  proveedorActual: Proveedor = <Proveedor>{};

  usuarioLocal: any;
  usuario: Usuario = <Usuario>{};

  constructor(
    private fb: FormBuilder,
    private tpoDocumentoServicio: TipoDocumentoService,
    private proveedorServicio: ProveedorService
  ) {

    this.usuarioLocal = localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.usuarioLocal);

    this.tpoDocumentoServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaTiposDocumento = data;
      },
      error: (e) => {},
    });

    this.formularioProveedor = this.fb.group({
      razonSocial: ['', Validators.required],
      idTipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: new FormControl(
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
    });
  }

  obtenerProveedores() {
    this.proveedorServicio.listar().subscribe({
      next: (data) => {
        if (data) {
          this.listaProveedores = data;
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
    this.obtenerProveedores();
  }

  buscarProveedores(termino: string): Proveedor[] {
    let proveedoresArr: Proveedor[] = [];
    termino = termino.toLowerCase();

    for (const proveedor of this.listaProveedores) {
      let razonSocial = proveedor.razonSocial.toLowerCase();
      if (razonSocial.indexOf(termino) >= 0) {
        proveedoresArr.push(proveedor);
      }
    }

    return proveedoresArr;
  }

  buscarProveedor(termino: string) {
    if (termino !== '') {
      this.listaProveedores = this.buscarProveedores(termino);
    } else {
      this.obtenerProveedores();
    }
  }

  crear() {
    this.tituloAccion = 'Nuevo Proveedor';
    this.botonAccion = 'Guardar';
    this.proveedorActual = <Proveedor>{};
    this.formularioProveedor.reset();
  }

  editar(proveedor: Proveedor) {
    this.tituloAccion = 'Editar Proveedor';
    this.botonAccion = 'Actualizar';
    this.proveedorActual = proveedor;

    this.formularioProveedor.controls['razonSocial'].setValue(
      proveedor.razonSocial
    );
    this.formularioProveedor.controls['idTipoDocumento'].setValue(
      proveedor.idTipoDocumento
    );
    this.formularioProveedor.controls['numeroDocumento'].setValue(
      proveedor.numeroDocumento
    );
    this.formularioProveedor.controls['telefono'].setValue(proveedor.telefono);
    this.formularioProveedor.controls['email'].setValue(proveedor.email);
    this.formularioProveedor.controls['direccion'].setValue(
      proveedor.direccion
    );
  }

  guardar() {
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false,
    });
    Swal.showLoading(null);

    let peticion: Observable<any>;
    let { idProveedor } = this.proveedorActual;
    this.proveedorActual = { idProveedor, ...this.formularioProveedor.value };

    if (this.proveedorActual.idProveedor) {
      peticion = this.proveedorServicio.actualizar(
        this.proveedorActual.idProveedor,
        this.proveedorActual
      );
    } else {
      peticion = this.proveedorServicio.guardar(this.formularioProveedor.value);
    }

    peticion.subscribe((resp) => {
      if (resp) {
        Swal.fire({
          title: 'El proveedor fue procesado',
          timer: 2000,
          icon: 'success',
        });
        this.obtenerProveedores();
        this.proveedorActual = <Proveedor>{};
        this.formularioProveedor.reset();
      } else {
        Swal.fire({
          title: 'No se pudo procesar el proveedor',
          timer: 2000,
          icon: 'error',
        });
      }
    });
  }

  eliminar(proveedor: Proveedor) {
    Swal.fire({
      title: '¿Desea eliminar el proveedor?',
      text: proveedor.razonSocial,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.proveedorServicio.eliminar(proveedor.idProveedor).subscribe({
          next: () => {
            Swal.fire({
              title: 'El proveedor fue eliminado',
              timer: 1000,
              icon: 'success',
            });
            this.obtenerProveedores();
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
