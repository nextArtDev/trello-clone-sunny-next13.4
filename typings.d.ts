interface Board {
  //We specify that the key type should be and what value type would be it can be <string , string>. we say get that exact TypedColumn key and Column value
  columns: Map<TypedColumn, Column>
}

// we just want to get just three types of keys in our board columns, we use enum:
type TypedColumn = 'todo' | 'inprogress' | 'done'

//id of column could be one of that enums
interface Column {
  id: TypedColumn
  todos: Todo[]
}

//We define structure based on response that we get back, thats what "$" dows!

interface Todo {
  $id: string
  $createdAt: string
  title: string
  status: TypedColumn
  image?: image
}

interface Image {
  //bucketId is from storage container that we set
  bucketId: string
  fileId: string
}

// difference between interface and type is that you can extends interface: interface Column extends Todo
