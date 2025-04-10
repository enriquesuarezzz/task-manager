'use client'
import { useState } from 'react'

type Props = {
  onCreate: (task: Task) => void
}

export type Task = {
  id: string
  title: string
  description: string
  date: string
  priority: 'Low' | 'Medium' | 'High'
}

export default function NewTaskForm({ onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      date,
      priority,
    }

    onCreate(newTask)

    // Clear form
    setTitle('')
    setDescription('')
    setDate('')
    setPriority('Low')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-lg bg-white p-4 shadow"
    >
      <h2 className="text-lg font-semibold">Create New Task</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border p-2"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded border p-2"
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded border p-2"
        required
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as 'Low' | 'Medium' | 'High')
        }
        className="w-full rounded border p-2"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Add Task
      </button>
    </form>
  )
}
