export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🧠 Zona de Genialidade</h1>
        <p className="text-xl text-gray-600 mb-8">
          Descubra seu potencial com o assessment de Genius Zone
        </p>
        <div className="space-y-4">
          <a
            href="/auth/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </a>
          <a
            href="/auth/register"
            className="inline-block ml-4 px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Registrar
          </a>
        </div>
      </div>
    </main>
  );
}
