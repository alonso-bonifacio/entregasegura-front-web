import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { TipoDocumento } from "src/app/Interfaces/tipo-documento";
import { Proveedor } from "src/app/Interfaces/proveedor";
import { TipoDocumentoService } from 'src/app/Services/tipo-documento.service';
import { ProveedorService } from 'src/app/Services/proveedor.service';


@Component({
  selector: 'app-modal-proveedor',
  templateUrl: './modal-proveedor.component.html',
  styleUrls: ['./modal-proveedor.component.css']
})
export class ModalProveedorComponent {/*
  formularioProveedor:FormGroup;
  tituloAccion:string = "Nuevo Proveedor";
  botonAccion:string = "Guardar";
  listaTiposDocumento: TipoDocumento[] = [];

  constructor(
    @Inject("") public datosProveedor: Proveedor,
    private fb: FormBuilder,
    private tpoDocumentoServicio: TipoDocumentoService,
    private proveedorServicio: ProveedorService
  ) {
    this.formularioProveedor = this.fb.group({
      razonSocial : ['', Validators.required],
      tipoDocumento : ['', Validators.required],
      numeroDocumento : ['', Validators.required],
      direccion : ['', Validators.required],
      telefono : ['', Validators.required],
      email : ['', Validators.required],
    });

    if(this.datosProveedor != null){
        this.tituloAccion = "Editar Proveedor";
        this.botonAccion = "Actualizar";
    }

    this.tpoDocumentoServicio.listar().subscribe({
      next: (data) => {
        if(data) this.listaTiposDocumento = data;
      },
      error:(e) =>{}
    });
  }


  ngOnInit(): void {
    if(this.datosProveedor != null){
      this.formularioProveedor.patchValue({
        razonSocial : this.datosProveedor.razonSocial,
        tipoDocumento : this.datosProveedor.tipoDocumento,
        numeroDocumento : this.datosProveedor.numeroDocumento,
        direccion : this.datosProveedor.direccion,
        telefono : this.datosProveedor.telefono,
        email : this.datosProveedor.email
      });
    }
  }

  guardarEditar(){
    const proveedor: Proveedor = {
      idProveedor: this.datosProveedor == null ? 0: this.datosProveedor.idProveedor,
      razonSocial: this.formularioProveedor.value.razonSocial,
      tipoDocumento: "",
      numeroDocumento: this.formularioProveedor.value.numeroDocumento,
      direccion: this.formularioProveedor.value.direccion,
      telefono: this.formularioProveedor.value.telefono,
      email: this.formularioProveedor.value.email,
    };

    if(this.datosProveedor == null){
      this.proveedorServicio.guardar(proveedor).subscribe({
        next:(data) => {}, error:(e) =>{}
      });
    } else {
      this.proveedorServicio.actualizar(proveedor.idProveedor, proveedor).subscribe({
        next: (data) => {},
        error: (e) => {},
      });
    }
  }

*/
}
