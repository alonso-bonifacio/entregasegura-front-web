import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutRoutingModule } from './layout-routing.module';

import { ProveedorComponent } from './Pages/proveedor/proveedor.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { CategoriaComponent } from './Pages/categoria/categoria.component';
import { SharedModule } from 'src/app/Shared/shared/shared.module';
import { ModalProveedorComponent } from './Modales/modal-proveedor/modal-proveedor.component';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { DomseguroPipe } from './pipes/domseguro.pipe';
import { ClienteComponent } from './Pages/cliente/cliente.component';
import { TrabajadorComponent } from './Pages/trabajador/trabajador.component';
import { IngresoComponent } from './Pages/ingreso/ingreso.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';


@NgModule({
  declarations: [
    ProveedorComponent,
    ProductoComponent,
    CategoriaComponent,
    ModalProveedorComponent,
    InicioComponent,
    DomseguroPipe,
    ClienteComponent,
    TrabajadorComponent,
    IngresoComponent,
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LayoutModule { }
