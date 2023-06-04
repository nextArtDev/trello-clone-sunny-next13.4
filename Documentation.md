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
```typescript
const useBoardStore = create<BoardState>((set) => ({
  board: {
   // we create a new column whit that specific types and invoke it
   columns: new Map<TypedColumn, Column>()
  },
  getBoard: () => set(() => ({})),
}))
```
