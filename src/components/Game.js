import React, { useState } from 'react';
// ... autres imports

function Game() {
  // ... état et autres fonctions

  const startGame = () => {
    setIsLoading(true); // Ajoutez cet état si ce n'est pas déjà fait
    
    setTimeout(() => {
      // Code pour démarrer la partie
      setIsGameStarted(true);
      setIsLoading(false);
    }, 2000); // 2000 millisecondes = 2 secondes
  };

  return (
    <div>
      {/* ... le reste du code pour afficher le jeu */}
    </div>
  );
}

export default Game;