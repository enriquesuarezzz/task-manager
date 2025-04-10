import { FiMoreHorizontal, FiCalendar } from 'react-icons/fi'
import { format } from 'date-fns'

type Props = {
  title: string
  description: string
  date: string
  priority: 'Low' | 'Medium' | 'High'
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
  title,
  description,
  date,
  priority,
}: Props) {
  return (
    <div className="space-y-2 rounded-lg border bg-white px-4 py-3 shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <FiMoreHorizontal className="cursor-pointer text-gray-400" />
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
