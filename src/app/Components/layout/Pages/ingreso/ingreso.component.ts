import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ingreso } from 'src/app/Interfaces/ingreso';
import { Producto } from 'src/app/Interfaces/producto';
import { Proveedor } from 'src/app/Interfaces/proveedor';
import { TipoComprobante } from 'src/app/Interfaces/tipo-comprobante';
import { Trabajador } from 'src/app/Interfaces/trabajador';
import { Usuario } from 'src/app/Interfaces/usuario';
import { IngresoService } from 'src/app/Services/ingreso.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { ProveedorService } from 'src/app/Services/proveedor.service';
import { TipoComprobanteService } from 'src/app/Services/tipo-comprobante.service';
import { TrabajadorService } from 'src/app/Services/trabajador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css'],
})
export class IngresoComponent {
  titulosTabla: string[] = [
    'N°',
    'Proveedor',
    'Fecha',
    'T. Comprobante',
    'Serie',
    'Correlativo',
    'Precio Total',
    'Registrado por',
    'Estado',
    'Opciones',
  ];

  listaIngresos: Ingreso[] = [];

  formularioIngreso: FormGroup;
  formularioDetalle!: FormArray<any>;
  tituloAccion: string = 'Nuevo Ingreso';
  botonAccion: string = 'Guardar';

  listaProveedores: Proveedor[] = [];
  listaTrabajadores: Trabajador[] = [];
  listaTpoComprobante: TipoComprobante[] = [];
  listaProductos: Producto[] = [];

  ingresoActual: Ingreso = <Ingreso>{};
  precioUnitario: number = 0;

  usuarioLocal: any;
  usuario: Usuario = <Usuario>{};

  constructor(
    private fb: FormBuilder,
    private proveedorServicio: ProveedorService,
    private tpoComprobanteServicio: TipoComprobanteService,
    private productoServicio: ProductoService,
    private trabajadorServicio: TrabajadorService,
    private ingresoServicio: IngresoService
  ) {
    this.usuarioLocal = localStorage.getItem('usuario');
    this.usuario = JSON.parse(this.usuarioLocal);
    this.proveedorServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaProveedores = data;
      },
    });

    this.trabajadorServicio.listar().subscribe({
      next: (data) => {
        this.listaTrabajadores = data;
      },
      error: (e) => {},
    });

    this.tpoComprobanteServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaTpoComprobante = data;
      },
      error: (e) => {},
    });

    this.productoServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaProductos = data;
      },
      error: (e) => {},
    });

    this.ingresoServicio.listar().subscribe({
      next: (data) => {
        if (data) this.listaIngresos = data;
      },
      error: (e) => {},
    });

    this.formularioIngreso = this.fb.group({
      idProveedor: ['', Validators.required],
      idTrabajador: ['', Validators.required],
      fecha: ['', Validators.required],
      idTipoComprobante: ['', Validators.required],
      serie: ['', Validators.required],
      correlativo: ['', Validators.required],
      importeTotal: ['', Validators.required],
      igv: ['', Validators.required],
      precioTotal: ['', Validators.required],
      estado: ['', Validators.required],
      detalleIngresos: this.fb.array([]),
    });
  }

  obtenerIngresos() {
    this.ingresoServicio.listar().subscribe({
      next: (data) => {
        if (data) {
          this.listaIngresos = data;
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
    this.obtenerIngresos();
  }

  buscarIngresos(termino: string): Ingreso[] {
    let ingresosArr: Ingreso[] = [];
    termino = termino.toLowerCase();

    for (const ingreso of this.listaIngresos) {
      let nombre = ingreso.correlativo.toLowerCase();
      if (nombre.indexOf(termino) >= 0) {
        ingresosArr.push(ingreso);
      }
    }

    return ingresosArr;
  }

  buscarIngreso(termino: string) {
    if (termino !== '') {
      this.listaIngresos = this.buscarIngresos(termino);
    } else {
      this.obtenerIngresos();
    }
  }

  crear() {
    this.tituloAccion = 'Nuevo Ingreso';
    this.botonAccion = 'Guardar';
    this.ingresoActual = <Ingreso>{};
    this.formularioIngreso.reset();
    let formDetalle: any = this.formularioDetalle;
    try {
      formDetalle.clear();
    } catch (e) {}
  }

  guardar() {
    // TODO
    console.log(this.formularioIngreso.value);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false,
    });

    Swal.showLoading(null);

    this.ingresoServicio
      .guardar(this.formularioIngreso.value)
      .subscribe((resp) => {
        if (resp) {
          Swal.fire({
            title: 'El ingreso fue procesado',
            timer: 2000,
            icon: 'success',
          });
          this.obtenerIngresos();
          this.ingresoActual = <Ingreso>{};
          this.formularioIngreso.reset();
          let formDetalle: any = this.formularioDetalle;
          try {
            formDetalle.clear();
          } catch (e) {}
        } else {
          Swal.fire({
            title: 'No se pudo procesar el ingreso',
            timer: 2000,
            icon: 'error',
          });
        }
      });
  }

  visualizar(ingreso: Ingreso) {
    // TODO
    this.ingresoActual = ingreso;
  }

  agregarDetalle() {
    this.formularioDetalle = this.formularioIngreso.get(
      'detalleIngresos'
    ) as FormArray;
    this.formularioDetalle.push(this.generarFilaDetalle());
  }

  generarFilaDetalle() {
    return this.fb.group({
      idProducto: ['', Validators.required],
      cantidad: ['', Validators.required],
      importe: ['', Validators.required],
      fechaCompra: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  eliminarDetalle(i: number) {
    Swal.fire({
      title: '¿Esta seguro de eliminar el Detalle?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.formularioDetalle = this.formularioIngreso.get(
          'detalleIngresos'
        ) as FormArray;
        this.formularioDetalle.removeAt(i);
      }
    });
  }

  get detalleIngresos() {
    return this.formularioIngreso.get('detalleIngresos') as FormArray;
  }

  onChange(event: any, i: number) {
    let idProducto: number = event.target.value;
    let productoSeleccionado: Producto = <Producto>{};
    console.log(idProducto);
    this.listaProductos.forEach((producto) => {
      if (producto.idProducto == idProducto) productoSeleccionado = producto;
    });

    let inputPrecioU: any = document.getElementById('precioU' + i);
    console.log(inputPrecioU);

    inputPrecioU.value = productoSeleccionado.precioUnitario;

    let filaDetalle: any = this.formularioDetalle.at(i);
    filaDetalle.controls['estado'].setValue('En curso');

    let inputCantidad: any = document.getElementById('cantidad' + i);
    inputCantidad.value = 0;

    let inputImporte: any = document.getElementById('importe' + i);
    inputImporte.value = 0;
  }

  calcular(valor: any, i: number) {
    let inputPrecioU: any = document.getElementById('precioU' + i);
    let inputImporte: any = document.getElementById('importe' + i);
    let importe =
      Math.round(parseFloat(valor) * parseFloat(inputPrecioU.value) * 100) /
      100;
    inputImporte.value = importe;
    let filaDetalle: any = this.formularioDetalle.at(i);
    filaDetalle.controls['importe'].setValue(importe);
    this.calcularImporteTotal(
      this.formularioIngreso.controls['detalleIngresos'].value
    );
  }

  calcularImporteTotal(detalles: any) {
    let importeTotal = 0;
    let igv = 0;
    let precioTotal = 0;

    for (let index = 0; index < detalles.length; index++) {
      importeTotal += detalles[index].importe;
    }

    let inputImporteTotal: any = document.getElementById('importeTotal');
    inputImporteTotal.value = importeTotal;

    igv = Math.round(importeTotal * 0.18 * 100) / 100;
    let inputIgv: any = document.getElementById('igv');
    inputIgv.value = igv;

    precioTotal = Math.round((importeTotal + igv) * 100) / 100;
    let inputPrecioTotal: any = document.getElementById('precioTotal');
    inputPrecioTotal.value = precioTotal;

    this.formularioIngreso.controls['importeTotal'].setValue(importeTotal);
    this.formularioIngreso.controls['igv'].setValue(igv);
    this.formularioIngreso.controls['precioTotal'].setValue(precioTotal);
  }

  eliminar(ingreso: Ingreso) {
    Swal.fire({
      title: '¿Desea eliminar el ingreso?',
      text: ingreso.correlativo,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.ingresoServicio.eliminar(ingreso.idIngreso).subscribe({
          next: () => {
            Swal.fire({
              title: 'El ingreso fue eliminado',
              timer: 1000,
              icon: 'success',
            });
            this.obtenerIngresos();
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
