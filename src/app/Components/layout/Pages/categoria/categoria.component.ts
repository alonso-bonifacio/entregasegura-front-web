import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/Interfaces/categoria';
import { Usuario } from 'src/app/Interfaces/usuario';
import { CategoriaService } from 'src/app/Services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent implements OnInit {
  titulosTabla: string[] = ['#', 'Nombre', 'Descripción', 'Opciones'];
  listaCategorias: Categoria[] = [];

  formularioCategoria: FormGroup;
  tituloAccion: string = 'Nueva Categoria';
  botonAccion: string = 'Guardar';
  categoriaActual: Categoria = <Categoria>{};
  usuarioLocal: any;
  usuario: Usuario = <Usuario>{};

  constructor(
    private fb: FormBuilder,
    private categoriaServicio: CategoriaService
  ) {
    this.formularioCategoria = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
    this.usuarioLocal = localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.usuarioLocal);
  }

  obtenerCategorias() {
    this.categoriaServicio.listar().subscribe({
      next: (data) => {
        if (data) {
          this.listaCategorias = data;
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
    this.obtenerCategorias();
  }

  buscarCategoria(termino: string) {
    if (termino !== '') {
      this.listaCategorias = this.buscarCategorias(termino);
    } else {
      this.obtenerCategorias();
    }
  }

  buscarCategorias(termino: string): Categoria[] {
    let categoriasArr: Categoria[] = [];
    termino = termino.toLowerCase();

    for (const categoria of this.listaCategorias) {
      let nombre = categoria.nombre.toLowerCase();
      if (nombre.indexOf(termino) >= 0) {
        categoriasArr.push(categoria);
      }
    }

    return categoriasArr;
  }

  crear() {
    this.tituloAccion = 'Nueva Categoria';
    this.botonAccion = 'Guardar';
    this.categoriaActual = <Categoria>{};
    this.formularioCategoria.reset();
  }

  editar(categoria: Categoria) {
    this.tituloAccion = 'Editar Categoria';
    this.botonAccion = 'Actualizar';
    this.categoriaActual = categoria;
    this.formularioCategoria.controls['nombre'].setValue(categoria.nombre);
    this.formularioCategoria.controls['descripcion'].setValue(
      categoria.descripcion
    );
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
    let { idCategoria } = this.categoriaActual;
    this.categoriaActual = { idCategoria, ...this.formularioCategoria.value };
    console.log(this.categoriaActual);

    if (this.categoriaActual.idCategoria) {
      peticion = this.categoriaServicio.actualizar(
        this.categoriaActual.idCategoria,
        this.categoriaActual
      );
      console.log('Se actualiza');
      console.log(this.categoriaActual);
    } else {
      peticion = this.categoriaServicio.guardar(this.formularioCategoria.value);
      console.log('Se guarda');
      console.log(this.categoriaActual);
    }

    peticion.subscribe((resp) => {
      if (resp) {
        Swal.fire({
          title: 'La categoria fue procesada',
          timer: 2000,
          icon: 'success',
        });
        this.obtenerCategorias();
        this.categoriaActual = <Categoria>{};
        this.formularioCategoria.reset();
      } else {
        Swal.fire({
          title: 'No se pudo procesar la categoria',
          timer: 2000,
          icon: 'error',
        });
      }
    });
  }

  eliminar(categoria: Categoria) {
    Swal.fire({
      title: '¿Desea eliminar la categoria?',
      text: categoria.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.categoriaServicio.eliminar(categoria.idCategoria).subscribe({
          next: () => {
            Swal.fire({
              title: 'La Categoria fue eliminado',
              timer: 1000,
              icon: 'success',
            });
            this.obtenerCategorias();
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
