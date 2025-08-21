import { useState, useRef } from "react"
import "./Game.css"

const Game = ({
  verifyLetter,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
}) => {
  const [letter, setLetter] = useState("")
  const letterInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (letter.trim() !== "") {
      verifyLetter(letter)
      setLetter("")
      letterInputRef.current.focus()
    }
  }

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação</span>: {score}
      </p>
      <h1>Advinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>
      
      <div className="wordContainer">
        {letters.map((l, i) =>
          guessedLetters.includes(l) ? (
            <span className="letter" key={i}>
              {l}
            </span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>
      
      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            onChange={(e) => {
              const value = e.target.value
              if (/^[A-Za-zÀ-ÿ]$/.test(value) || value === '') {
                setLetter(value)
              }
            }}
            required
            value={letter}
            ref={letterInputRef}
            autoComplete="off"
          />
          <button>Jogar!</button>
        </form>
      </div>
      
      <div className="wrongLettersContainer">
        <p>Letras já utilizadas:</p>
        {wrongLetters.map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
      </div>
    </div>
  )
}

export default Game