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
  updateTask as apiUpdateTask,
} from '@/../lib/api'
import type { Task } from '@/../lib/types'

type TasksByStatus = {
  pending: Task[]
  ongoing: Task[]
  done: Task[]
}

const emptyTasksByStatus = (): TasksByStatus => ({
  pending: [],
  ongoing: [],
  done: [],
})

// Spinner component
const Spinner = () => (
  <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-white">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
  </div>
)

export default function Board() {
  const [tasks, setTasks] = useState<TasksByStatus>(emptyTasksByStatus())
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      const allTasks = await fetchTasks()

      const organized: TasksByStatus = emptyTasksByStatus()

      allTasks.forEach((task: Task & { _id: string }) => {
        organized[task.status as keyof TasksByStatus].push({
          id: task._id,
          title: task.title,
          description: task.description,
          date: task.date,
          priority: task.priority,
          status: task.status,
        })
      })

      setTasks(organized)
      setLoading(false)
    }

    loadTasks()
  }, [])

  // Handle drag and drop
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
      const updatedTask = {
        ...movedTask,
        status: destination.droppableId as Task['status'],
      }
      destCol.splice(destination.index, 0, updatedTask)

      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      }))

      apiUpdateTask(updatedTask)
    }
  }

  // Handle creating a new task
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
          status: saved.status,
        },
      ],
    }))

    setShowForm(false)
  }

  // Handle updating a task
  const handleUpdateTask = async (updatedTask: Task) => {
    await apiUpdateTask(updatedTask)

    setTasks((prev) => {
      const updated: TasksByStatus = emptyTasksByStatus()

      for (const status in prev) {
        updated[status as keyof TasksByStatus] = prev[
          status as keyof TasksByStatus
        ].map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
        )
      }

      return updated
    })

    setEditingTask(null)
    setShowForm(false)
  }

  // Handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    await apiDeleteTask(taskId)

    setTasks((prev) => {
      const updated: TasksByStatus = emptyTasksByStatus()

      for (const status in prev) {
        updated[status as keyof TasksByStatus] = prev[
          status as keyof TasksByStatus
        ].filter((task) => task.id !== taskId)
      }

      return updated
    })
  }

  // Handle task editing
  const handleEditTask = (taskId: string) => {
    const allTasks = [...tasks.pending, ...tasks.ongoing, ...tasks.done]
    const taskToEdit = allTasks.find((task) => task.id === taskId)
    if (taskToEdit) {
      setEditingTask(taskToEdit)
      setShowForm(true)
    }
  }

  // Handle canceling the edit form
  const handleCancelEdit = () => {
    setEditingTask(null)
    setShowForm(false)
  }

  const columnTitles = {
    pending: 'Pending',
    ongoing: 'Ongoing',
    done: 'Done',
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid h-fit grid-cols-1 gap-6 bg-[#a1cfd8] p-6 md:grid-cols-3">
        {Object.entries(tasks).map(([columnId, tasksInColumn]) => (
          <Droppable droppableId={columnId} key={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-[300px] rounded-lg bg-white p-4 shadow"
              >
                {/* Column header */}
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {columnTitles[columnId as keyof typeof columnTitles]}
                  </h2>
                  {columnId === 'pending' && (
                    <button
                      onClick={() => {
                        setShowForm((prev) => !prev)
                        setEditingTask(null)
                      }}
                      className="rounded bg-blue-100 px-2 text-xl font-bold text-blue-500"
                    >
                      +
                    </button>
                  )}
                </div>

                {/* Task form */}
                {columnId === 'pending' && showForm && (
                  <div className="mb-4">
                    <NewTaskForm
                      task={editingTask ?? undefined}
                      onCreate={
                        editingTask ? handleUpdateTask : handleCreateTask
                      }
                      onCancel={handleCancelEdit}
                    />
                  </div>
                )}

                {/* Spinner or Tasks */}
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex h-24 items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : (
                    <>
                      {tasksInColumn.map((task, idx) => (
                        <Draggable
                          draggableId={task.id}
                          index={idx}
                          key={task.id}
                        >
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
                    </>
                  )}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
