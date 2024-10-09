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
        </div>
      )}
    </div>
  );
}

export default Game;