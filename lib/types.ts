export type Priority = 'Low' | 'Medium' | 'High'

export type Task = {
  id: string
  title: string
  description: string
  date: string
  priority: Priority
  status: 'pending' | 'ongoing' | 'done'
}
