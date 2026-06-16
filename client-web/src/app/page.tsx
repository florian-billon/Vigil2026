import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <img src="C:\Users\flori\CascadeProjects\vigil\client-desktop\src-tauri\icons\icon.ico" alt="VIGIL Logo" className="w-16 h-16 mr-4" />
          <h1 className="text-4xl font-bold">VIGIL</h1>
        </div>
        <p className="text-center text-gray-300 text-xl mb-8">
          Operational Control Room
        </p>
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Collaborative platform for Releases and Incidents management
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/login" className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded transition">
              Login
            </a>
            <a href="/dashboard" className="bg-secondary hover:bg-secondary/80 text-white px-6 py-2 rounded transition">
              Dashboard
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}