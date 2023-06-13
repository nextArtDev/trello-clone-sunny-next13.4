import { databases } from '@/appwrite'
import { DATABASE_ID, TODOS_COLLECTION_ID } from '../data'
export const getTodosGroupedBycolumn = async () => {
  // we create database before in appwrite but we should pass to it the database id, and the collection id from our appwrite application that we set.
  const data = await databases.listDocuments(DATABASE_ID, TODOS_COLLECTION_ID)

  //data returns back {total: 5, documents: Array(5)}, we extract document from it:
  const todos = data.documents

  // todos returns this form of ungrouped data:
  //back 0: {title: 'walk a dog', status: 'todo', image: null, $id: '647b1bdaefe9f6cfabe0', $createdAt: '2023-06-03T10:54:18.983+00:00', …}
  // 1: {title: 'Coding back', status: 'inprogress', image: null, $id: '647b5e016daf3283d335', $createdAt: '2023-06-03T15:36:33.449+00:00', …}
  // we take this array to reduce down to a map: Every single time we iterate over we get accumulator value that will gonna be the map object and each time we map through we get the todo itself
  const columns = todos.reduce((acc, todo) => {
    //is there any todo? no! so create a key (set) inside of that map, by status id
    if (!acc.get(todo.status)) {
      //setting the first key inside accumulator
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      })
    }
    // when we create a todo, push every todo with that special id (status: pending, done, inprogress) to its list, by accessing 'todo:[]' and pushing into it, not entire todo, but object of it
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      //we only gonna fetch the object if it exists from the response: if the response we're mapping through has an image, take this: image: JSON.parse(todo.image)
      //when we push the information into the database we would be storing as a json stringify value for the image
      ...(todo.image && { image: JSON.parse(todo.image) }),
    })
    return acc

    // our initial value is map with typed column and map column, accumulator value starts off as a new map, its an empty map and wouldn't have anything in that
  }, new Map<TypedColumn, Column>())

  // We transform data to a map, After mapping, above list would be updated to this form this entries:
  // 0: {"todo" => Object} key: "todo" value:{id: 'todo',todos: Array(2)}
  //1: {"inprogress" => Object} key: "inprogress" value: {id: 'inprogress',todos: Array(1)}

  //Know we need to write a function to ensure we always have a columns with empty todo array inside of it, we alway gonna populated empty todo array
  // if columns does not have inprogress, todo or done, add them with empty todos, for example when we delete everything

  //first we create an array with all the different columns
  const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done']
  // then we loop through them
  for (const columnType of columnTypes) {
    // if we have no todos
    if (!columns.get(columnType)) {
      //then set the column, so it wont break when we map through it
      columns.set(columnType, {
        id: columnType,
        todos: [],
      })
    }
  }
  //Sort column by the column type: in this tutorial we want to always show the todo, inprogress or done in that exact order, so we sort them in that order
  //So we sort them base on initial order: TypedColumn[] = ['todo', 'inprogress', 'done']

  const sortedColumns = new Map(
    //we can write [...columns.entries()].sort... or below: we get all the key-value pairs and create an array from it and using array "sort" mapping function
    Array.from(columns.entries()).sort(
      //if the index of key of the first value (in const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done']) is less than second value, rearrange them to the "columnTypes" shape
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  )
  // we get board and give it the sorted columns
  const board: Board = {
    columns: sortedColumns,
  }
  return board
}
