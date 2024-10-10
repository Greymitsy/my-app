import React, { useState, useEffect } from 'react';
import FlappyPierre from '../components/flappy-pierre';

function Game() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setIsGameStarted(true);
        setIsLoading(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const startGame = () => {
    if (!isLoading && !isGameStarted) {
      setIsLoading(true);
      setScore(0);
    }
  };

  const handleJump = () => {
    if (isGameStarted) {
      console.log("Sauter action déclenchée");
      // Ajoutez ici la logique pour faire sauter FlappyPierre
    }
  };

  const handleGameOver = (finalScore) => {
    setIsGameStarted(false);
    setScore(finalScore);
  };

  return (
    <div className="game-container">
      {!isGameStarted ? (
        <div className="start-screen">
          <h1>Flappy Pierre</h1>
          {score > 0 && <p>Dernier score : {score}</p>}
          <button 
            onClick={startGame} 
            disabled={isLoading}
            className="start-button"
          >
            {isLoading ? 'Chargement...' : 'Jouer'}
          </button>
        </div>
      ) : (
        <div className="game-area">
          <FlappyPierre 
            onJump={handleJump}
            onGameOver={handleGameOver}
          />
          <button 
            onClick={handleJump} 
            className="jump-button"
            style={{ backgroundColor: 'white', border: '1px solid black', padding: '10px', marginTop: '20px' }}
          >
            Sauter (Espace)
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;