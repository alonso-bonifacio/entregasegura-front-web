import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/Interfaces/categoria';
import { Presentacion } from 'src/app/Interfaces/presentacion';
import { Producto } from 'src/app/Interfaces/producto';
import { UnidadesMedida } from 'src/app/Interfaces/unidades-medida';
import { Usuario } from 'src/app/Interfaces/usuario';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { PresentacionService } from 'src/app/Services/presentacion.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UnidadesMedidaService } from 'src/app/Services/unidades-medida.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent implements OnInit {
  titulosTabla: string[] = [
    '#',
    'Codigo',
    'Nombre',
    'Descripción',
    'Categoria',
    'Presentación',
    'U. Medida',
    'Cant.',
    'P. U.',
    'Stock',
    'Opciones',
  ];

  listaProductos: Producto[] = [];

  formularioProducto: FormGroup;
  tituloAccion: string = 'Nuevo Producto';
  botonAccion: string = 'Guardar';
  listaCategorias: Categoria[] = [];
  listaPresentaciones: Presentacion[] = [];
  listaUndMedidas: UnidadesMedida[] = [];
  productoActual: Producto = <Producto>{};

  usuarioLocal: any;
  usuario: Usuario = <Usuario>{};

  constructor(
    private fb: FormBuilder,
    private categoriaServicio: CategoriaService,
    private presentacionServicio: PresentacionService,
    private undMedidaServicio: UnidadesMedidaService,
    private productoServicio: ProductoService
  ) {
    this.usuarioLocal = localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.usuarioLocal);
    this.categoriaServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaCategorias = data;
      },
      error: (e) => {},
    });

    this.formularioProducto = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioUnitario: ['', Validators.required],
      cantidadContenido: ['', Validators.required],
      stock: ['', Validators.required],
      idMedida: ['', Validators.required],
      idPresentacion: ['', Validators.required],
      idCategoria: ['', Validators.required],
    });

    this.presentacionServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaPresentaciones = data;
      },
      error: (e) => {},
    });

    this.undMedidaServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaUndMedidas = data;
      },
      error: (e) => {},
    });
  }

  obtenerProductos() {
    this.productoServicio.listar().subscribe({
      next: (data) => {
        if (data) {
          this.listaProductos = data;
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
    this.obtenerProductos();
  }

  buscarProductos(termino: string): Producto[] {
    let productosArr: Producto[] = [];
    termino = termino.toLowerCase();

    for (const producto of this.listaProductos) {
      let nombre = producto.nombre.toLowerCase();
      if (nombre.indexOf(termino) >= 0) {
        productosArr.push(producto);
      }
    }

    return productosArr;
  }

  buscarProducto(termino: string) {
    if (termino !== '') {
      this.listaProductos = this.buscarProductos(termino);
    } else {
      this.obtenerProductos();
    }
  }

  crear() {
    this.tituloAccion = 'Nuevo Producto';
    this.botonAccion = 'Guardar';
    this.productoActual = <Producto>{};
    this.formularioProducto.reset();
  }

  editar(producto: Producto) {
    this.tituloAccion = 'Editar Producto';
    this.botonAccion = 'Actualizar';
    this.productoActual = producto;

    this.formularioProducto.controls['codigo'].setValue(producto.codigo);
    this.formularioProducto.controls['nombre'].setValue(producto.nombre);
    this.formularioProducto.controls['descripcion'].setValue(
      producto.descripcion
    );
    this.formularioProducto.controls['precioUnitario'].setValue(
      producto.precioUnitario
    );
    this.formularioProducto.controls['cantidadContenido'].setValue(
      producto.cantidadContenido
    );
    this.formularioProducto.controls['stock'].setValue(producto.stock);
    this.formularioProducto.controls['idMedida'].setValue(producto.idMedida);
    this.formularioProducto.controls['idPresentacion'].setValue(
      producto.idPresentacion
    );
    this.formularioProducto.controls['idCategoria'].setValue(
      producto.idCategoria
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
    let { idProducto } = this.productoActual;
    this.productoActual = { idProducto, ...this.formularioProducto.value };

    if (this.productoActual.idProducto) {
      peticion = this.productoServicio.actualizar(
        this.productoActual.idProducto,
        this.productoActual
      );
    } else {
      peticion = this.productoServicio.guardar(this.formularioProducto.value);
    }

    peticion.subscribe((resp) => {
      if (resp) {
        Swal.fire({
          title: 'El producto fue procesado',
          timer: 2000,
          icon: 'success',
        });
        this.obtenerProductos();
        this.productoActual = <Producto>{};
        this.formularioProducto.reset();
      } else {
        Swal.fire({
          title: 'No se pudo procesar el producto',
          timer: 2000,
          icon: 'error',
        });
      }
    });
  }

  eliminar(producto: Producto) {
    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: producto.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.productoServicio.eliminar(producto.idProducto).subscribe({
          next: () => {
            Swal.fire({
              title: 'El producto fue eliminado',
              timer: 1000,
              icon: 'success',
            });
            this.obtenerProductos();
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
