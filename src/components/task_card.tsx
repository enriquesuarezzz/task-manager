import { FiMoreHorizontal, FiCalendar } from 'react-icons/fi'
import { format } from 'date-fns'
import { useState } from 'react'

type Props = {
  id: string
  title: string
  description: string
  date: string
  priority: 'Low' | 'Medium' | 'High'
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Low':
      return 'bg-green-100 text-green-500'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-500'
    case 'High':
      return 'bg-red-100 text-red-500'
    default:
      return ''
  }
}

export default function TaskCard({
  id,
  title,
  description,
  date,
  priority,
  onDelete,
  onEdit,
}: Props) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative space-y-2 rounded-lg border bg-white px-4 py-3 shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div className="relative">
          <FiMoreHorizontal
            className="cursor-pointer text-gray-400"
            onClick={() => setShowMenu((prev) => !prev)}
          />
          {showMenu && (
            <div className="absolute right-0 z-10 mt-2 w-32 rounded-md border bg-white shadow-lg">
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => {
                  onEdit(id)
                  setShowMenu(false)
                }}
              >
                Edit
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                onClick={() => {
                  onDelete(id)
                  setShowMenu(false)
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-500">
          <FiCalendar />
          {format(new Date(date), 'yyyy-MM-dd')}
        </div>
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${getPriorityColor(priority)}`}
        >
          {priority}
        </span>
      </div>
    </div>
  )
}
