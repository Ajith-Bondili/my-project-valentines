import React, { useRef, useEffect, useState } from 'react';

const canvasWidth = 400;
const canvasHeight = 400;
const cellSize = 20;
const targetScore = 5; 

export default function SnakeGame({ onGameComplete }) {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState(randomFoodPosition());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [specialHeart, setSpecialHeart] = useState(false);

  function randomFoodPosition() {
    const x = Math.floor(Math.random() * (canvasWidth / cellSize));
    const y = Math.floor(Math.random() * (canvasHeight / cellSize));
    return { x, y };
  }

  // Listen for arrow key presses to change direction
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Game loop: update snake position, check collisions, handle food
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check for wall or self collision
        if (
          newHead.x < 0 ||
          newHead.x >= canvasWidth / cellSize ||
          newHead.y < 0 ||
          newHead.y >= canvasHeight / cellSize ||
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // Food collision: grow snake and generate new food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prevScore) => {
            const newScore = prevScore + 1;
            if (newScore === targetScore) {
              setShowSecret(true);
              setSpecialHeart(true);
            }
            if (specialHeart && newScore > targetScore) {
              onGameComplete();
            }
            return newScore;
          });
          setFood(randomFoodPosition());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, onGameComplete, specialHeart]);

  // Draw the game state on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw background (light pink)
    ctx.fillStyle = '#ffe6f0';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw the snake: head is a darker red, body in lighter pink
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ff3366' : '#ff99aa';
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });

    // Draw food as a heart
    drawHeart(
      ctx,
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2
    );
  }, [snake, food]);

  // Function to draw a heart shape on the canvas
  function drawHeart(ctx, x, y, size) {
    ctx.save();
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // Left side curve
    ctx.bezierCurveTo(
      x - size,
      y - topCurveHeight,
      x - size * 1.5,
      y + size / 3,
      x,
      y + size
    );
    // Right side curve
    ctx.bezierCurveTo(
      x + size * 1.5,
      y + size / 3,
      x + size,
      y - topCurveHeight,
      x,
      y + topCurveHeight
    );
    ctx.closePath();
    ctx.fillStyle = '#ff6699';
    ctx.fill();
    ctx.restore();
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h2 className="text-2xl font-bold text-red-600">Score: {score}</h2>
      {showSecret && (
        <div className="text-4xl font-bold text-red-500 animate-bounce">
          SECRET!
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border-2 border-[#ff3366]"
      />
      {gameOver && (
        <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-full transition duration-300">
        Restart
      </button>
      )}
    </div>
  );
}