import { ID, databases, storage } from '@/appwrite'
import { DATABASE_ID, TODOS_COLLECTION_ID } from '@/data'
import { getTodosGroupedBycolumn } from '@/lib/getTodosGroupedByColumn'
import uploadImage from '@/lib/uploadImage'
import { create } from 'zustand'

interface BoardState {
  board: Board
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void
  newTaskInput: string
  newTaskType: TypedColumn
  image: File | null

  searchString: string
  setSearchString: (searchString: string) => void

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => null
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void

  setNewTaskInput: (input: string) => void
  setNewTaskType: (columnId: TypedColumn) => void
  setImage: (image: File | null) => void
}
export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: '',
  newTaskInput: '',
  newTaskType: 'todo',
  image: null,
  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    // We want to fetch all the columns and grouped them by the different types including todo : [...all the todos], inprogress:[...all of inprogress] and done:[...all the done tasks].
    const board = await getTodosGroupedBycolumn()
    // what "set" would do is setting the global state
    set({ board })
  },

  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns)

    //delete todoId from newColumns
    newColumns.get(id)?.todos.splice(taskIndex, 1)

    set({ board: { columns: newColumns } })
    if (todo.image) {
      await storage.deleteFile(todo.image.buckedId, todo.image.fileId)
    }

    await databases.deleteDocument(DATABASE_ID, TODOS_COLLECTION_ID, todo.$id)
  },
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setImage: (image: File | null) => set({ image }),

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(DATABASE_ID, TODOS_COLLECTION_ID, todo.$id, {
      title: todo.title,
      status: columnId,
    })
  },
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined

    if (image) {
      const fileUploaded = await uploadImage(image)
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        }
      }
    }
    const { $id } = await databases.createDocument(
      process.env.DATABASE_ID!,
      process.env.TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        //include image if exists
        ...(file && { image: JSON.stringify(file) }),
      }
    )
    set({ newTaskInput: '' })

    set((state) => {
      const newColumns = new Map(state.board.columns)

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        // include image if it exists
        ...(file && { image: file }),
      }

      const column = newColumns.get(columnId)

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo)
      }

      return {
        board: {
          columns: newColumns,
        },
      }
    })
  },
}))
