'use client'
import getUrl from '@/lib/getUrl'
import { useBoardStore } from '@/store/BoardStrore'
import { XCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd'

interface TodoCardProps {
  todo: Todo
  index: number
  id: TypedColumn
  innerRef: (element: HTMLElement | null) => void
  draggableProps: DraggableProvidedDraggableProps
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}

const TodoCard: FC<TodoCardProps> = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
  const deleteTask = useBoardStore((state) => state.deleteTask)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image)
        if (url) {
          setImageUrl(url.toString())
        }
      }
      fetchImage()
    }
  }, [todo])
  return (
    <div
      className="bg-white/10 backdrop-blur-xl shadow-md rounded-md space-y-2 drop-shadow-md "
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button
          onClick={() => deleteTask(index, todo, id)}
          className="text-red-500 hover:text-red-600 "
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>
      {/* Add image */}
      {imageUrl && (
        <div className="h-full w-full rounded-b-md ">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  )
}

export default TodoCard
