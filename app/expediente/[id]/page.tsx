import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import databaseJson from "@/data/database.json"

export default function ExpedientePage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Type the database
  const database = databaseJson as any

  // Find the expediente
  const expediente = database.expediente.find((exp: any) => exp.id === id)

  if (!expediente) {
    notFound()
  }

  // Find related data
  const datos = database.datos.find((d: any) => d.id === expediente.datos_id)
  const operario = database.operario.find((op: any) => op.id === expediente.operario_id)
  const tipoRegistro = datos ? database.tipo_registro.find((tr: any) => tr.id === datos.tipo_registro_id) : null
  const puntoTerminal = datos ? database.puntos_terminales.find((pt: any) => pt.id === datos.punto_terminal_id) : null
  const espacio = puntoTerminal ? database.espacios.find((e: any) => e.id === puntoTerminal.espacio_id) : null
  const instalacion = espacio ? database.instalacion.find((i: any) => i.id === espacio.instalacion_id) : null

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" className="mb-4" asChild>
            <a href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a expedientes
            </a>
          </Button>
          <h1 className="text-3xl font-bold text-black">Expediente: {expediente.codigo}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Expediente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Código</p>
                  <p className="font-medium">{expediente.codigo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <div className="flex items-center">
                    {expediente.estado ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
                        <span>Activo</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-gray-400 mr-1" />
                        <span>Inactivo</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{format(new Date(expediente.fecha), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="font-medium">{expediente.hora.substring(0, 5)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Observaciones</p>
                <p>{expediente.observaciones}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datos de Medición</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {datos ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tipo de Registro</p>
                      <p className="font-medium">{tipoRegistro?.nombre || "No disponible"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor</p>
                      <p className="font-medium">{datos.valor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-medium">{format(new Date(datos.fecha), "dd/MM/yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hora</p>
                      <p className="font-medium">{datos.hora.substring(0, 5)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Observaciones</p>
                    <p>{datos.observaciones}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No hay datos de medición disponibles</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Operario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {operario ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{operario.mail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{operario.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">DNI</p>
                    <p className="font-medium">{operario.dni}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No hay información del operario disponible</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {instalacion ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Instalación</p>
                    <p className="font-medium">{instalacion.nombre_inst}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo</p>
                    <p className="font-medium">{instalacion.tipo_inst}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Espacio</p>
                    <p className="font-medium">{espacio?.nombre || "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Punto Terminal</p>
                    <p className="font-medium">
                      {puntoTerminal
                        ? `${puntoTerminal.tipo_agua ? "Agua Caliente" : "Agua Fría"} - 
                         ${puntoTerminal.tipo_grifo ? "Principal" : "Secundario"}`
                        : "No disponible"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No hay información de ubicación disponible</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

