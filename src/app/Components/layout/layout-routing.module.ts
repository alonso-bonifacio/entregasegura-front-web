import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProveedorComponent } from './Pages/proveedor/proveedor.component';
import { CategoriaComponent } from './Pages/categoria/categoria.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { ClienteComponent } from './Pages/cliente/cliente.component';
import { TrabajadorComponent } from './Pages/trabajador/trabajador.component';
import { IngresoComponent } from './Pages/ingreso/ingreso.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: InicioComponent },
      { path: 'proveedores', component: ProveedorComponent },
      { path: 'categorias', component: CategoriaComponent },
      { path: 'productos', component: ProductoComponent },
      { path: 'clientes', component: ClienteComponent },
      { path: 'trabajadores', component: TrabajadorComponent },
      { path: 'ingresos', component: IngresoComponent },
      { path: 'usuarios', component: UsuarioComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
