import React, { useState, useEffect } from 'react';
import SnakeGame from './SnakeGame';

export default function App() {
  const [stage, setStage] = useState('start');
  const [scale, setScale] = useState(1);
  const [showNoButton, setShowNoButton] = useState(true);
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [noButtonText, setNoButtonText] = useState("No");
  const [noButtonClicked, setNoButtonClicked] = useState(false);

  // Container scaling effect during the complete stage
  useEffect(() => {
    if (stage === 'complete') {
      const interval = setInterval(() => {
        setScale(prev => Math.min(prev + 0.1, 2.5));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // New effect: continuously grow the Yes button naturally while in the complete stage
  useEffect(() => {
    if (stage === 'complete') {
      const interval = setInterval(() => {
        setYesButtonScale(prev => prev + 0.1);
      }, 500); // Adjust the interval and increment value as needed
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleGameComplete = () => {
    setStage('complete');
  };

  const handleAccept = () => {
    setStage('accepted');
  };

  const handleNoClick = () => {
    setNoButtonClicked(true);
    setNoButtonText("YOU MEANT YES RIGHT???");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-400 to-pink-300 text-white p-6">
      {stage === 'start' && (
        <div className="flex flex-col items-center space-y-6 bg-white bg-opacity-10 p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold">Unlock the secret question</h1>
          <button
            onClick={() => setStage('game')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-full transition duration-300"
          >
            Start the Game
          </button>
        </div>
      )}

      {stage === 'game' && (
        <div className="w-full flex flex-col items-center">
          <SnakeGame onGameComplete={handleGameComplete} />
        </div>
      )}

      {stage === 'complete' && (
        <div 
          className="flex flex-col items-center space-y-6 bg-white bg-opacity-10 p-8 rounded-xl shadow-lg"
          style={{ transform: `scale(${scale})` }}
        >
          <h1 className="text-3xl font-bold text-red-200">Will you be my Valentine?</h1>
          <div className="flex gap-4">
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-full transition-all duration-300"
              style={{ 
                transform: `scale(${yesButtonScale})`,
                zIndex: yesButtonScale > 2 ? 50 : 1
              }}
            >
              Yes
            </button>
            {showNoButton && !noButtonClicked && (
              <button
                onClick={handleNoClick}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white text-xl font-bold rounded-full transition duration-300"
              >
                {noButtonText}
              </button>
            )}
            {noButtonClicked && (
              <div className="text-xl font-bold text-red-500 animate-bounce">
                {noButtonText}
              </div>
            )}
          </div>
        </div>
      )}

      {stage === 'accepted' && (
        <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-10 p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold">Yay! Thank you POOKS! ❤️</h1>
          <div className="flex space-x-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>❤️</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}