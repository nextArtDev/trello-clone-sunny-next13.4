'use client'
import { useBoardStore } from '@/store/BoardStrore'
import { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

type Props = {}

const Board = (props: Props) => {
  const [board, getBoard] = useBoardStore((state) => [
    state.board,
    state.getBoard,
  ])

  useEffect(() => {
    // getBoard()
  }, [getBoard])
  console.log(board)
  return (
    <h1>Hi</h1>
    // <DragDropContext>
    //   <Droppable droppableId="board" direction="horizontal" type="column">
    //     {(provided) => <div> sd</div>}
    //   </Droppable>
    // </DragDropContext>
  )
}

export default Board
