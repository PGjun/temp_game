"use client"

import { useEffect, useState } from "react"

const TIME = 1.5
const LIFE = 2

export default function Home() {
  const [board, setBoard] = useState(createInitialBoard())
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [lives, setLives] = useState(LIFE)
  const [gameWon, setGameWon] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const [timer, setTimer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TIME) // 5초 타이머

  // 타이머 시작 함수
  function startTimer() {
    setTimer(
      setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 0.1
          if (newTime <= 0) {
            clearInterval(timer) // 타이머 종료
            setGameOver(true) // 게임 오버
            return 0
          }
          return parseFloat(newTime.toFixed(1))
        })
      }, 100)
    ) // 0.1초 간격으로 업데이트
  }

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
    // 타이머가 아직 시작되지 않았다면 시작합니다.
    if (!timer) {
      startTimer()
    }

    let newX = playerPosition.x
    let newY = playerPosition.y

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
        return // If it's not an arrow key, do nothing.
    }

    // 유효한 이동인지 확인
    const isValidMove = board[newY] && board[newY][newX] === "blue"

    if (isValidMove) {
      // If the player reached the yellow square
      if (newX === 2 && newY === 5) {
        setGameWon(true)
        if (timer) {
          clearInterval(timer) // 승리 시 타이머 중지
          setTimer(null)
        }
      }

      // Update the board with the new position
      const newBoard = board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex === playerPosition.y && colIndex === playerPosition.x) {
            return "green" // Mark the trail green
          }
          if (rowIndex === newY && colIndex === newX) {
            return "red" // Move the player to the new position
          }
          return cell // Keep the existing state for all other cells
        })
      )

      setBoard(newBoard)
      setPlayerPosition({ x: newX, y: newY })
    } else {
      // 유효하지 않은 이동일 경우 라이프를 감소시킵니다.
      decreaseLife()
    }
  }

  function decreaseLife() {
    setLives((prevLives) => {
      const newLives = prevLives - 1
      if (newLives <= 0) {
        setGameOver(true)
        setTimeout(resetGame, 1000) // 게임을 리셋합니다.
      }
      return newLives
    })
  }

  function resetGame() {
    // 타이머 정리
    if (timer) {
      clearInterval(timer)
    }
    setTimer(null)
    setTimeLeft(TIME) // 타이머 시간 재설정

    setBoard(createInitialBoard())
    setPlayerPosition({ x: 0, y: 0 })
    setLives(LIFE)
    setGameWon(false)
    setGameOver(false)
  }

  useEffect(() => {
    if (gameWon) {
      // 게임 승리 알림을 보여주고, 게임을 초기화합니다.
      setTimeout(() => {
        alert("축하합니다! 게임에서 이겼습니다!")
        resetGame()
      }, 100) // Delay the alert slightly for better UX
    } else if (gameOver) {
      // 게임 오버 알림을 보여주고, 게임을 초기화합니다.
      setTimeout(() => {
        alert("게임 오버! 다시 시도해보세요.")
        resetGame()
      }, 100)
    }
  }, [gameWon, gameOver])

  return (
    <div style={{ padding: "20px" }}>
      <h1 className='text-[24px]'>ㅋ</h1>
      {/* 라이프 표시 */}
      <div className='flex justify-between'>
        <div>
          <p>남은 시간: {timeLeft.toFixed(1)}초</p>
        </div>
        <div>
          {Array.from({ length: LIFE }, (_, i) => (
            <span key={i} style={{ color: i < lives ? "red" : "grey" }}>
              ♥
            </span>
          ))}
        </div>
      </div>

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
      <div className='flex justify-between px-[40px]'>
        <button
          className='w-[40px] mt-[40px] h-[40px] border text-[30px] flex items-center justify-center'
          onClick={() => movePlayer("ArrowLeft")}
        >
          ⬅️
        </button>
        <button
          className='w-[40px] mt-[40px] h-[40px] border text-[30px] flex items-center justify-center'
          onClick={() => movePlayer("ArrowUp")}
        >
          ⬆️
        </button>
        <button
          className='w-[40px] mt-[40px] h-[40px] border text-[30px] flex items-center justify-center'
          onClick={() => movePlayer("ArrowDown")}
        >
          ⬇️
        </button>
        <button
          className='w-[40px] mt-[40px] h-[40px] border text-[30px] flex items-center justify-center'
          onClick={() => movePlayer("ArrowRight")}
        >
          ➡️
        </button>
      </div>
    </div>
  )
}
