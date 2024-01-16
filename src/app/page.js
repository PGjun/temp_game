"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [board, setBoard] = useState(createInitialBoard())
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [gameWon, setGameWon] = useState(false)

  function createInitialBoard() {
    return new Array(6).fill(null).map(() => new Array(6).fill("blue"))
  }

  useEffect(() => {
    function handleKeyPress(event) {
      movePlayer(event.key)
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  function movePlayer(key) {
    setPlayerPosition((prev) => {
      let newX = prev.x
      let newY = prev.y

      switch (key) {
        case "ArrowUp":
          newY = Math.max(newY - 1, 0)
          break
        case "ArrowDown":
          newY = Math.min(newY + 1, 5)
          break
        case "ArrowLeft":
          newX = Math.max(newX - 1, 0)
          break
        case "ArrowRight":
          newX = Math.min(newX + 1, 5)
          break
        default:
          break
      }

      const newBoard = [...board]
      newBoard[prev.y][prev.x] = "green"
      setBoard(newBoard)

      if (newX === 2 && newY === 2) {
        setGameWon(true)
      }

      return { x: newX, y: newY }
    })
  }

  useEffect(() => {
    if (gameWon) {
      alert("이김!")
    }
  }, [gameWon])
  return (
    <div>
      <h1>Move the Red Square to the Yellow Square</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 50px)" }}>
        {board.map((row, rowIndex) =>
          row.map((color, colIndex) => {
            let backgroundColor = color
            if (
              rowIndex === playerPosition.y &&
              colIndex === playerPosition.x
            ) {
              backgroundColor = "red"
            }
            if (rowIndex === 2 && colIndex === 2) {
              backgroundColor = "yellow"
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{ width: "50px", height: "50px", backgroundColor }}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
