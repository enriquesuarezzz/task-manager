import Board from '@/components/board'

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <header className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="inline-block bg-gradient-to-r from-orange-300 via-orange-300 to-green-300 bg-clip-text text-4xl font-extrabold text-transparent">
            TaskManager
          </h1>
          <span>📋 </span>
        </div>
        <p className="mt-2 text-lg font-bold text-white">
          Organize your tasks with ease and clarity ✨
        </p>
      </header>

      <Board />
    </main>
  )
}
