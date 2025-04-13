import type { Task } from './types'

//fetch tasks from the API
export async function fetchTasks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tasks`)
  return res.json()
}

//create a new task in the API
export async function createTask(task: {
  title: string
  description: string
  date: string
  priority: string
  status: string
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  return res.json()
}

//delete a task from the API
export async function deleteTask(taskId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/tasks/${taskId}`,
    {
      method: 'DELETE',
    },
  )

  if (!res.ok) {
    throw new Error('Failed to delete task')
  }

  return res.json()
}

//update a task in the API
export async function updateTask(task: Task) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/tasks/${task.id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    },
  )
  return res.json()
}
