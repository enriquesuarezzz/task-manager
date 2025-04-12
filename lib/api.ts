export async function fetchTasks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/tasks`)
  return res.json()
}

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

// Add the deleteTask function
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
