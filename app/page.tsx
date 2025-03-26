import { ExpedientesTable } from "@/components/expedientes-table"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-black">Control de Legionella - Expedientes</h1>
        <ExpedientesTable />
      </div>
    </main>
  )
}

