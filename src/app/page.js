"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [board, setBoard] = useState(createInitialBoard())
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [gameWon, setGameWon] = useState(false)

  // 초기 보드 설정, 'blue'로 설정된 길을 따라가게 됩니다.
  function createInitialBoard() {
    let initialBoard = new Array(6)
      .fill(null)
      .map(() => new Array(6).fill("default"))

    // 이미지에 정의된 길을 설정합니다.
    // 예시로는 시작점인 (0,0)과 목적지인 (2,2)를 포함한 길입니다.
    const pathCoordinates = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 5 },
    ]

    pathCoordinates.forEach((point) => {
      initialBoard[point.y][point.x] = "blue"
    })

    return initialBoard
  }

  useEffect(() => {
    function handleKeyPress(event) {
      if (!gameWon) {
        movePlayer(event.key)
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [board, gameWon])

  function movePlayer(key) {
    setPlayerPosition((prev) => {
      let newX = prev.x
      let newY = prev.y

      switch (key) {
        case "ArrowUp":
          newY = newY > 0 ? newY - 1 : newY
          break
        case "ArrowDown":
          newY = newY < 5 ? newY + 1 : newY
          break
        case "ArrowLeft":
          newX = newX > 0 ? newX - 1 : newX
          break
        case "ArrowRight":
          newX = newX < 5 ? newX + 1 : newX
          break
        default:
          return prev // If it's not an arrow key, we don't want to move the player
      }

      // Check if the new position is a blue square
      if (board[newY][newX] === "blue") {
        // If the player reached the yellow square
        if (newX === 2 && newY === 5) {
          setGameWon(true)
        }

        // Update the board with the new position
        const newBoard = board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (rowIndex === prev.y && colIndex === prev.x) {
              // Mark the trail green
              return "green"
            }
            if (rowIndex === newY && colIndex === newX) {
              // Move the player to the new position
              return "red"
            }
            // Keep the existing state for all other cells
            return cell
          })
        )
        setBoard(newBoard)
        return { x: newX, y: newY }
      }

      // If the new position is not a blue square, don't move the player
      return prev
    })
  }
  useEffect(() => {
    if (gameWon) {
      // 게임 승리 알림을 보여주고, 게임을 초기화합니다.
      setTimeout(() => {
        alert("축하합니다! 게임에서 이겼습니다!")
        // 게임 보드와 플레이어 위치를 초기화합니다.
        setBoard(createInitialBoard())
        setPlayerPosition({ x: 0, y: 0 })
        setGameWon(false) // 게임 승리 상태를 다시 false로 설정합니다.
      }, 100) // Delay the alert slightly for better UX
    }
  }, [gameWon])

  return (
    <div style={{ padding: "20px" }}>
      <h1>Move the Red Square to the Yellow Square</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 50px)",
          gridGap: "5px",
          justifyContent: "center",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let style = {
              width: "50px",
              height: "50px",
              backgroundColor: cell,
              border: "1px solid black",
            }
            if (cell === "default") {
              style.backgroundColor = "white"
            }
            if (
              rowIndex === playerPosition.y &&
              colIndex === playerPosition.x
            ) {
              style.backgroundColor = "red" // Player current position
            }
            if (rowIndex === 5 && colIndex === 2) {
              style.backgroundColor = "yellow" // Destination
            }

            return <div key={`${rowIndex}-${colIndex}`} style={style} />
          })
        )}
      </div>
    </div>
  )
}
