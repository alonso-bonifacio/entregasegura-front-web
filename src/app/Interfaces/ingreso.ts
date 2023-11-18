import { DetalleIngreso } from "./detalle-ingreso"

export interface Ingreso {
  idIngreso:	number,
  idProveedor:	number,
  razonSocial:	string,
  idTrabajador:	number,
  nombreTrabajador:	string,
  apellidoTrabajador:	string,
  fecha:	string,
  idTipoComprobante: number,
  nombreComprobante:	string,
  serie:	string,
  correlativo:	string,
  importeTotal:	number,
  igv:	number,
  precioTotal:	number,
  estado:	string,
  detalleIngresos: DetalleIngreso[]
}
