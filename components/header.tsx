import { Database } from "lucide-react"

export function Header() {
  return (
    <header className="w-full bg-black text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6" />
          <span className="text-xl font-bold">LegionApp</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li className="hover:text-gray-300 transition-colors">
              <a href="#">Expedientes</a>
            </li>
            <li className="hover:text-gray-300 transition-colors">
              <a href="#">Instalaciones</a>
            </li>
            <li className="hover:text-gray-300 transition-colors">
              <a href="#">Operarios</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

