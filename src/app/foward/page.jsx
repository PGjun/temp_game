"use client"

import { useState, useEffect } from "react"

const keyOptions = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
const gameTime = 15 // 게임 시간을 30초로 설정
const keyCount = 5

function generateRandomKeys(numberOfKeys) {
  return Array.from(
    { length: numberOfKeys },
    () => keyOptions[Math.floor(Math.random() * keyOptions.length)]
  )
}

export default function Home() {
  const [currentKeys, setCurrentKeys] = useState([])
  const [score, setScore] = useState(0)
  const [userInputKeys, setUserInputKeys] = useState([])
  const [timeLeft, setTimeLeft] = useState(gameTime)
  const [started, setStarted] = useState(false)
  const [difficulty, setDifficulty] = useState(keyCount)

  useEffect(() => {
    setCurrentKeys(generateRandomKeys(difficulty))
    resetGame() // 게임을 리셋합니다.
  }, [difficulty])

  useEffect(() => {
    let timerId

    if (started && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (started && timeLeft === 0) {
      alert(`Game Over! ${score}점..`)
      resetGame()
    }

    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [timeLeft, started])

  function handleKeyPress(event) {
    if (!started) {
      setTimeLeft(gameTime)
      setStarted(true)
    }

    const nextKey = currentKeys[userInputKeys.length]
    if (event.key === nextKey) {
      const newUserInputKeys = [...userInputKeys, event.key]
      setUserInputKeys(newUserInputKeys)

      if (newUserInputKeys.length === currentKeys.length) {
        setScore(score + 1)
        setCurrentKeys(generateRandomKeys(difficulty))
        setUserInputKeys([])
      }
    } else {
      // Reset on wrong key press
      setUserInputKeys([])
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)

    // Cleanup event listener
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentKeys, userInputKeys, score, timeLeft])

  function resetGame() {
    setScore(0)
    setCurrentKeys(generateRandomKeys(difficulty))
    setUserInputKeys([])
    setTimeLeft(gameTime) // Stop the timer
    setStarted(false)
  }

  function handleButtonClick(keyValue) {
    handleKeyPress({ key: keyValue })
  }

  return (
    <div>
      <div className='flex justify-center gap-5 mb-[20px]'>
        <div>난이도</div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
        >
          <option value='3'>Easy (3 keys)</option>
          <option value='5'>Medium (5 keys)</option>
          <option value='7'>Hard (7 keys)</option>
          <option value='10'>Expert (10 keys)</option>
        </select>
        <div className='w-[80px]'>니 점수: {score}</div>
        <div className='w-[120px]'>남은 시간: {timeLeft}s</div>
      </div>
      <div className='flex justify-center h-[70px] m-auto'>
        <div className='flex items-center border-blue-400 border-[4px] px-[5px]'>
          {currentKeys.map((key, index) => (
            <ArrowKey
              key={index}
              direction={key}
              active={index === userInputKeys.length}
            />
          ))}
        </div>
      </div>

      <section className='flex flex-col items-center px-[40px] mt-[40px] gap-3'>
        <button
          className='w-[60px] h-[60px] border text-[50px] flex items-center justify-center'
          onClick={() => handleButtonClick("ArrowUp")}
        >
          ⬆️
        </button>
        <div className='flex gap-3'>
          <button
            className='w-[60px] h-[60px] border text-[50px] flex items-center justify-center'
            onClick={() => handleButtonClick("ArrowLeft")}
          >
            ⬅️
          </button>

          <button
            className='w-[60px] h-[60px] border text-[50px] flex items-center justify-center'
            onClick={() => handleButtonClick("ArrowDown")}
          >
            ⬇️
          </button>
          <button
            className='w-[60px] h-[60px] border text-[50px] flex items-center justify-center'
            onClick={() => handleButtonClick("ArrowRight")}
          >
            ➡️
          </button>
        </div>
      </section>
    </div>
  )
}

function ArrowKey({ direction, active }) {
  const arrowKeyMap = {
    ArrowUp: "⬆️",
    ArrowRight: "➡️",
    ArrowDown: "⬇️",
    ArrowLeft: "⬅️",
  }

  const arrowClass = active ? " text-[45px]" : ""
  const arrowBoxClass = active ? " bg-green-400 rounded" : ""

  return (
    <div
      className={`w-[55px] flex items-center justify-center text-[40px] h-[55px]  ${arrowBoxClass}`}
    >
      <div className={` ${arrowClass}`}>{arrowKeyMap[direction]}</div>
    </div>
  )
}
