"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import databaseJson from "@/data/database.json"

// Define types based on the JSON structure
type Expediente = {
  id: number
  fecha: string
  hora: string
  estado: boolean
  observaciones: string
  codigo: string
  datos_id: number
  operario_id: number
}

type Operario = {
  id: number
  contraseña: string
  mail: string
  telefono: string
  dni: string
  proteccion_datos: boolean
  empresa_id: number
  instalacion_id: number
}

type Datos = {
  id: number
  valor: number
  fecha: string
  hora: string
  observaciones: string
  tipo_registro_id: number
  punto_terminal_id: number
}

type Database = {
  expediente: Expediente[]
  operario: Operario[]
  datos: Datos[]
  [key: string]: any
}

export function ExpedientesTable() {
  // Load data from the JSON file
  const database = databaseJson as Database

  const [expedientes, setExpedientes] = useState<Expediente[]>([])
  const [filteredExpedientes, setFilteredExpedientes] = useState<Expediente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Expediente | null
    direction: "ascending" | "descending"
  }>({
    key: null,
    direction: "ascending",
  })

  // Load data on component mount
  useEffect(() => {
    setExpedientes(database.expediente)
    setFilteredExpedientes(database.expediente)
  }, [])

  // Apply filters when dependencies change
  useEffect(() => {
    let result = [...expedientes]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (exp) =>
          exp.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.observaciones.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply date filter
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      result = result.filter((exp) => exp.fecha === dateStr)
    }

    // Apply status filter
    if (statusFilter !== null) {
      const status = statusFilter === "active"
      result = result.filter((exp) => exp.estado === status)
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredExpedientes(result)
    setCurrentPage(1)
  }, [searchTerm, selectedDate, statusFilter, sortConfig, expedientes])

  // Handle sorting
  const requestSort = (key: keyof Expediente) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredExpedientes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredExpedientes.length / itemsPerPage)

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedDate(undefined)
    setStatusFilter(null)
    setSortConfig({ key: null, direction: "ascending" })
  }

  // Get operator name by ID
  const getOperarioById = (id: number) => {
    const operario = database.operario.find((op) => op.id === id)
    return operario ? operario.mail.split("@")[0] : "Desconocido"
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar por código o observaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-black focus:ring-black"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={es}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
                  <Filter className="mr-2 h-4 w-4" />
                  Estado
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "active"}
                  onCheckedChange={() => setStatusFilter(statusFilter === "active" ? null : "active")}
                >
                  Activo
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "inactive"}
                  onCheckedChange={() => setStatusFilter(statusFilter === "inactive" ? null : "inactive")}
                >
                  Inactivo
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={resetFilters} className="border-gray-300 hover:bg-gray-100">
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Active filters */}
        {(searchTerm || selectedDate || statusFilter !== null) && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="outline" className="bg-gray-100">
                Búsqueda: {searchTerm}
                <button className="ml-2 hover:text-gray-700" onClick={() => setSearchTerm("")}>
                  ×
                </button>
              </Badge>
            )}
            {selectedDate && (
              <Badge variant="outline" className="bg-gray-100">
                Fecha: {format(selectedDate, "dd/MM/yyyy")}
                <button className="ml-2 hover:text-gray-700" onClick={() => setSelectedDate(undefined)}>
                  ×
                </button>
              </Badge>
            )}
            {statusFilter !== null && (
              <Badge variant="outline" className="bg-gray-100">
                Estado: {statusFilter === "active" ? "Activo" : "Inactivo"}
                <button className="ml-2 hover:text-gray-700" onClick={() => setStatusFilter(null)}>
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="cursor-pointer" onClick={() => requestSort("codigo")}>
                <div className="flex items-center">
                  Código
                  {sortConfig.key === "codigo" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort("fecha")}>
                <div className="flex items-center">
                  Fecha
                  {sortConfig.key === "fecha" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Hora</TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort("estado")}>
                <div className="flex items-center">
                  Estado
                  {sortConfig.key === "estado" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Operario</TableHead>
              <TableHead>Observaciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((expediente) => (
                <TableRow key={expediente.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <TableCell className="font-medium">{expediente.codigo}</TableCell>
                  <TableCell>{format(new Date(expediente.fecha), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{expediente.hora.substring(0, 5)}</TableCell>
                  <TableCell>
                    {expediente.estado ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
                        <span>Activo</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 text-gray-400 mr-1" />
                        <span>Inactivo</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getOperarioById(expediente.operario_id)}</TableCell>
                  <TableCell className="max-w-xs truncate" title={expediente.observaciones}>
                    {expediente.observaciones}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No se encontraron expedientes con los filtros aplicados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredExpedientes.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredExpedientes.length)} de{" "}
            {filteredExpedientes.length} expedientes
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

