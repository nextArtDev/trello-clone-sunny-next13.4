## Aliases
_@_ or other aliases that we choose goes us to the top level of our app; in _tsconfig.json_ we see:
```javascript
"paths":{
    "@/*":["./*"]
}
```
it means every _@_ brings us to the _'./'_ of our app.

## _Heroicons_
Supposed to be used tailwind
_npm install @heroicons/react_
and use it like:
```javascript
import { BeakerIcon } from '@heroicons/react/24'
 <BeakerIcon className="h-6 w-6 text-blue-500" />
```
## _flex-1_
Takes of entire width and uses up the full width, without that it just sticks to other elements beside it.
in Child it means it take out the maximum space that it has.

## _submit_ type button
Access our to the enter key for submitting the _form_ element around it.
**And by "hidden" property we use this characteristic without showing the button**

## _react-avatar_
It should be 'cleint side' component
    npm i react-avatar
<Avatar name="Foo Bar" />

## How to create a hidden gradient
```typescript
<div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0044D1] rounded-md filter blur-3xl opacity-50 -z-50" />
```

## _react-beautiful-dnd_
the main point is to import drag and drop context:
```typescript
    import { DragDropContext } from 'react-beautiful-dnd';
```

# Cload _appwrite_
<https://cloud.appwrite.io/console/project-647b1536118a656ccfc7/overview/platforms>
we should create a new _web app_ project and set a name for it.
1. first we should istall it : npm install appwrite
2. then crate a file in _package.json_ level named **appwrite.ts**
3. we import all the things we need and follow the "next" in appwrite website
4. define and export properties that i want to use.
```typescript
import { Client, Account, ID, Databases, Storage } from 'appwrite'

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('647b1536118a656ccfc7');


      const account = new Account(client)
  const databases = new Databases(client)
  const storage = new Storage(client)

  export {client, account, databases, storage, ID}
```
till _1:08:00_ part one

## Using Zustand
first install it: npm i zustand

then we copy **Typescript template** of it!
```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      {
        name: 'bear-storage',
      }
    )
  )
)
```

# Map() function

Syntax: map ((element , index , array)=> ... return value)
element: each individual element
index: index of our elements
array: the actual array itself
return: we have to return sth in each loop and it separate _map_ from forEach and other functions

1. _map()_ creates a new array from calling a function for every array element.
2. _map()_ calls a function for each element in an array
3. _map()_ does not execute the function for empty elements
4. _map()_ does not change the original array.

when NOT to use a map() function:
1. youre not using the array it returns; and/or
2. you're not returning a value from the callback.

example for refactoring the code:

```typescript
const players = [
    {name: 'Andy', score: 10},
    {name: 'Bob', score: 20},
    {name: 'Liz', score: 30}
    ];
// the shape for returning is: players.map(e=> ({//code}))
    const reformatted = players.map(({name , score})=> ({[name]:score}))
    // the output would be: [{Andy:10}, {Bob:20}, {Liz: 30}]
```

## How to create a Type definition by using Map()

```typescript
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
```
Then when we want to use it:
inside the _boardStore.tsx_ we initialize the board by map and invoke it, It would go a head and create a new map whit _TypedColumn_ and _Column_ type inside it:
```typescript
const useBoardStore = create<BoardState>((set) => ({
  board: {
   // we create a new column whit that specific types and invoke it
   columns: new Map<TypedColumn, Column>()
  },
  getBoard: () => set(() => ({})),
}))
```
## How to get document from _appwrite_ and convert it to mapped, grouped lists:

```typescript
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
```

## Modal

Our modal should be appear at the most _top level_ , it means _layout.tsx_

## Image Uploading

1. Set an _input_
2. make it type _file_
3. Create reference to it
4. make it hidden
5. We put input hidden and by clicking into the box, we click the reference and hidden input.
   

   ```typescript
   <input
                    type="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      //check if e is an image
                      if (!e.target.files![0].type.startsWith('image/')) return
                      setImage(e.target.files![0])
                    }}
                  />
   ```