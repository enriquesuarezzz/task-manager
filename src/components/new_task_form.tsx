'use client'
import { useState, useEffect } from 'react'
import type { Task } from '@/../lib/types'

type Props = {
  onCreate: (task: Task) => Promise<void>
  onCancel: () => void
  task?: Task // Make task optional
}

export default function NewTaskForm({ onCreate, onCancel, task }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')

  // If we are editing a task, pre-fill the form fields
  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setDate(task.date)
      setPriority(task.priority)
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTask: Task = {
      id: task ? task.id : crypto.randomUUID(),
      title,
      description,
      date,
      priority,
      status: task ? task.status : 'pending', // Default to 'pending' for new tasks
    }

    onCreate(newTask)

    // Clear form after submitting
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
      {/* Form title */}
      <h2 className="text-lg font-semibold">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>
      {/* Form title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border p-2"
        required
      />
      {/* Form description */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded border p-2"
        required
      />
      {/* Form date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded border p-2"
        required
      />

      {/* Form priority */}
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
      {/* Form buttons */}
      <div className="flex space-x-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {task ? 'Update Task' : 'Add Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-gray-300 px-4 py-2 text-black"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
