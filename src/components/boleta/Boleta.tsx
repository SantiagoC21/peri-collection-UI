"use client"

import React from "react"
import "./Boleta.css"

export type BoletaData = {
  cabecera: {
    empresa: {
      nombre: string
      direccion: string
      ruc: string
    }
    cliente: {
      nombre: string
      documento: string
      direccion: {
        calle: string
        distrito: string
        provincia: string
        departamento: string
      }
    }
    comprobante: {
      tipo: "B" | "F"
      numero: number
      serie: number
      fecha: string
    }
    pago: {
      metodo: string
      gravada: number
      igv: number
      total: number
    }
  }
  items: Array<{
    cantidad: number
    descripcion: string
    precio_unit: number
    subtotal: number
  }>
}

interface BoletaProps {
  data: BoletaData | null
}

const Boleta: React.FC<BoletaProps> = ({ data }) => {
  if (!data) return null

  const { cabecera, items } = data

  const dir = cabecera.cliente.direccion
  const direccionCompleta = `${dir.calle}, ${dir.distrito}, ${dir.provincia} - ${dir.departamento}`

  const fechaEmision = new Date(cabecera.comprobante.fecha).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const numeroComprobante = String(cabecera.comprobante.numero).padStart(8, "0")
  const serieComprobante = String(cabecera.comprobante.serie).padStart(3, "0")

  return (
    <div className="boleta-wrapper">
      <div className="actions no-print">
        <button className="btn-print" onClick={() => window.print()}>
          🖨️ Imprimir / Guardar PDF
        </button>
      </div>

      <div className="boleta-container">
        <header className="header">
          <div className="company-info">
            <h1 className="company-name">{cabecera.empresa.nombre}</h1>
            <p className="company-address">{cabecera.empresa.direccion}</p>
            <p className="company-contact">Tel: (01) 555-0909 | ventas@periperuana.com</p>
          </div>

          <div className="ruc-box">
            <div className="ruc-number">R.U.C. {cabecera.empresa.ruc}</div>
            <div className="doc-type">
              {cabecera.comprobante.tipo === "B" ? "BOLETA" : "FACTURA"} DE VENTA ELECTRÓNICA
            </div>
            <div className="doc-number">
              {cabecera.comprobante.tipo}
              {serieComprobante}-{numeroComprobante}
            </div>
          </div>
        </header>

        <section className="client-section">
          <div className="row">
            <div className="col">
              <strong>Señor(es):</strong> {cabecera.cliente.nombre}
            </div>
            <div className="col">
              <strong>Fecha Emisión:</strong> {fechaEmision}
            </div>
          </div>
          <div className="row">
            <div className="col">
              <strong>{cabecera.comprobante.tipo === "B" ? "DNI" : "RUC"}:</strong> {cabecera.cliente.documento}
            </div>
            <div className="col">
              <strong>Moneda:</strong> SOLES
            </div>
          </div>
          <div className="row">
            <div className="col full-width">
              <strong>Dirección:</strong> {direccionCompleta}
            </div>
          </div>
        </section>

        <table className="items-table">
          <thead>
            <tr>
              <th className="center">CANT.</th>
              <th className="left">DESCRIPCIÓN</th>
              <th className="right">P. UNIT</th>
              <th className="right">IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="center">{item.cantidad}</td>
                <td className="left">{item.descripcion}</td>
                <td className="right">{item.precio_unit.toFixed(2)}</td>
                <td className="right">{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="footer-section">
          <div className="left-footer">
            <p>
              <strong>Método de Pago:</strong> {cabecera.pago.metodo}
            </p>
            <div className="legal-notes">
              <p>Representación impresa de la Boleta de Venta Electrónica.</p>
              <p>Autorizado mediante Resolución de Superintendencia N° 123-2025/SUNAT.</p>
            </div>
          </div>

          <div className="totals-box">
            <div className="total-row">
              <span>OP. GRAVADA:</span>
              <span>S/ {cabecera.pago.gravada.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>I.G.V. (18%):</span>
              <span>S/ {cabecera.pago.igv.toFixed(2)}</span>
            </div>
            <div className="total-row main">
              <span>IMPORTE TOTAL:</span>
              <span>S/ {cabecera.pago.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Boleta
