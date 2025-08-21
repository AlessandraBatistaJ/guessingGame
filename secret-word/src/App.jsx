import { useCallback, useEffect, useState } from "react"

// components
import StartScreen from "./components/StartScreen"
import Game from "./components/Game"
import GameOver from "./components/GameOver"

// styles
import "./App.css"

// data
import { wordsList } from "./data/words"

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])
  
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * categories.length)]
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    return { category, word }
  }, [words])

  // start the game
  const startGame = useCallback(() => {
    clearLettersStates()
    setGuesses(3)
    setWrongLetters([])
    
    const { category, word } = pickWordAndCategory()
    let wordLetters = word.split("").map(l => l.toLowerCase())

    setPickedCategory(category)
    setPickedWord(word)
    setLetters(wordLetters)
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // process letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  // restart the game
  const retry = () => {
    setScore(0)
    setGuesses(3)
    setGuessedLetters([])
    setWrongLetters([])
    setGameStage(stages[0].name)
  }

  // clear letters state
  const clearLettersStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      clearLettersStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]
    
    if (uniqueLetters.length > 0 && 
        guessedLetters.length === uniqueLetters.length && 
        gameStage === "game") {
      setScore((actualScore) => actualScore + 100)
      startGame()
    }
  }, [guessedLetters, letters, startGame, gameStage])

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App