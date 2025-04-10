'use client'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import TaskCard from '@/components/task_card'
import { useState } from 'react'
import NewTaskForm from './new_task_form'

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

const initialData: TasksByStatus = {
  pending: [
    {
      id: '1',
      title: 'Learn React',
      description: 'Description with more text',
      date: '2023-10-22',
      priority: 'Low',
    },
    {
      id: '2',
      title: 'Review CSS Modules',
      description: 'Another task description',
      date: '2023-10-22',
      priority: 'Low',
    },
  ],
  ongoing: [],
  done: [
    {
      id: '3',
      title: 'Get a Job',
      description: 'Some description here',
      date: '2023-10-23',
      priority: 'High',
    },
  ],
}

export default function Board() {
  const [tasks, setTasks] = useState(initialData)
  const [showForm, setShowForm] = useState(false)

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
    }
  }

  const handleCreateTask = (task: Task) => {
    setTasks((prev) => ({
      ...prev,
      pending: [...prev.pending, task],
    }))
    setShowForm(false)
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

                {/* Optional form */}
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
                          <TaskCard {...task} />
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
