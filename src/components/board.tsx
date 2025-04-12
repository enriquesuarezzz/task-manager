'use client'

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import TaskCard from '@/components/task_card'
import NewTaskForm from './new_task_form'
import { useEffect, useState } from 'react'
import {
  fetchTasks,
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
} from '@/../lib/api'

type Priority = 'Low' | 'Medium' | 'High'

type Task = {
  id: string
  title: string
  description: string
  date: string
  priority: Priority
}

type TasksByStatus = {
  pending: Task[]
  ongoing: Task[]
  done: Task[]
}

export default function Board() {
  const [tasks, setTasks] = useState<TasksByStatus>({
    pending: [],
    ongoing: [],
    done: [],
  })

  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const loadTasks = async () => {
      const allTasks = await fetchTasks()

      const organized: TasksByStatus = {
        pending: [],
        ongoing: [],
        done: [],
      }

      allTasks.forEach((task: any) => {
        organized[task.status as keyof TasksByStatus].push({
          id: task._id,
          title: task.title,
          description: task.description,
          date: task.date,
          priority: task.priority,
        })
      })

      setTasks(organized)
    }

    loadTasks()
  }, [])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const sourceCol = [...tasks[source.droppableId as keyof typeof tasks]]
    const destCol = [...tasks[destination.droppableId as keyof typeof tasks]]
    const [movedTask] = sourceCol.splice(source.index, 1)

    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, movedTask)
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceCol,
      }))
    } else {
      destCol.splice(destination.index, 0, movedTask)
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      }))
      // You could also call an API here to update task.status if needed
    }
  }

  const handleCreateTask = async (task: Task) => {
    const saved = await apiCreateTask({
      ...task,
      status: 'pending',
    })

    setTasks((prev) => ({
      ...prev,
      pending: [
        ...prev.pending,
        {
          id: saved._id,
          title: saved.title,
          description: saved.description,
          date: saved.date,
          priority: saved.priority,
        },
      ],
    }))

    setShowForm(false)
  }

  const handleDeleteTask = async (taskId: string) => {
    await apiDeleteTask(taskId)

    setTasks((prev) => {
      const updated: TasksByStatus = {
        pending: [],
        ongoing: [],
        done: [],
      }

      for (const status in prev) {
        updated[status as keyof TasksByStatus] = prev[
          status as keyof TasksByStatus
        ].filter((task) => task.id !== taskId)
      }

      return updated
    })
  }

  const handleEditTask = (taskId: string) => {
    console.log('Edit task:', taskId)
    // Placeholder for opening a modal or inline form
  }

  const columnTitles = {
    pending: 'Pending',
    ongoing: 'Ongoing',
    done: 'Done',
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid min-h-screen grid-cols-1 gap-6 bg-gray-100 p-6 md:grid-cols-3">
        {Object.entries(tasks).map(([columnId, tasksInColumn]) => (
          <Droppable droppableId={columnId} key={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-[300px] rounded-lg bg-white p-4 shadow"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {columnTitles[columnId as keyof typeof columnTitles]}
                  </h2>
                  {columnId === 'pending' && (
                    <button
                      onClick={() => setShowForm((prev) => !prev)}
                      className="rounded bg-blue-100 px-2 text-xl font-bold text-blue-500"
                    >
                      +
                    </button>
                  )}
                </div>

                {columnId === 'pending' && showForm && (
                  <div className="mb-4">
                    <NewTaskForm onCreate={handleCreateTask} />
                  </div>
                )}

                <div className="space-y-4">
                  {tasksInColumn.map((task, idx) => (
                    <Draggable draggableId={task.id} index={idx} key={task.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            {...task}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
