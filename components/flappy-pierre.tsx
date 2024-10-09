'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"

const GRAVITY = 0.5
const JUMP = -8
const PIPE_WIDTH = 50
const PIPE_GAP = 150
const PIPE_SPEED = 2

export function FlappyPierreComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  const pierreRef = useRef({ y: 250, velocity: 0 })
  const pipesRef = useRef<{ x: number, topHeight: number }[]>([])
  const animationRef = useRef<number>()

  const colors = useMemo(() => ({
    sky: '#87CEEB',
    ground: '#8B4513',
    pipe: '#228B22',
    pierre: '#A9A9A9'
  }), [])

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw sky
    ctx.fillStyle = colors.sky
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw ground
    ctx.fillStyle = colors.ground
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20)

    // Draw Pierre (more stone-like)
    ctx.fillStyle = colors.pierre
    ctx.beginPath()
    ctx.moveTo(70, pierreRef.current.y + 10)
    ctx.lineTo(80, pierreRef.current.y)
    ctx.lineTo(90, pierreRef.current.y + 5)
    ctx.lineTo(95, pierreRef.current.y + 15)
    ctx.lineTo(90, pierreRef.current.y + 25)
    ctx.lineTo(80, pierreRef.current.y + 30)
    ctx.lineTo(70, pierreRef.current.y + 25)
    ctx.lineTo(65, pierreRef.current.y + 15)
    ctx.closePath()
    ctx.fill()

    // Draw pipes
    pipesRef.current.forEach((pipe) => {
      ctx.fillStyle = colors.pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
      ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.topHeight - PIPE_GAP - 20)
    })

    // Draw score
    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`Score: ${score}`, 10, 30)

    if (gameState === 'playing') {
      pierreRef.current.velocity += GRAVITY
      pierreRef.current.y += pierreRef.current.velocity

      // Generate new pipes
      if (pipesRef.current.length === 0 || pipesRef.current[pipesRef.current.length - 1].x < canvas.width - 200) {
        pipesRef.current.push({
          x: canvas.width,
          topHeight: Math.random() * (canvas.height - PIPE_GAP - 120) + 50
        })
      }

      // Update pipes
      pipesRef.current.forEach((pipe, index) => {
        pipe.x -= PIPE_SPEED

        if (pipe.x + PIPE_WIDTH < 0) {
          pipesRef.current.splice(index, 1)
          setScore(prevScore => prevScore + 1)
        }

        // Collision detection
        if (
          50 < pipe.x + PIPE_WIDTH &&
          90 > pipe.x &&
          (pierreRef.current.y < pipe.topHeight || pierreRef.current.y + 30 > pipe.topHeight + PIPE_GAP)
        ) {
          setGameState('end')
          if (score > highScore) {
            setHighScore(score)
          }
        }
      })

      // Check if Pierre hits the ground or ceiling
      if (pierreRef.current.y > canvas.height - 50 || pierreRef.current.y < 0) {
        setGameState('end')
        if (score > highScore) {
          setHighScore(score)
        }
      }
    }

    animationRef.current = requestAnimationFrame(updateGame)
  }, [gameState, score, highScore, colors])

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (gameState === 'playing') {
          pierreRef.current.velocity = JUMP
        } else {
          handleStart()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    if (gameState === 'playing') {
      updateGame()
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMounted, gameState, updateGame])

  const handleStart = useCallback(() => {
    pierreRef.current = { y: 250, velocity: 0 }
    pipesRef.current = []
    setScore(0)
    setGameState('playing')
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 relative overflow-hidden">
      {/* Left rocks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-contain bg-repeat-y" style={{backgroundImage: "url('/placeholder.svg?height=100&width=100')"}} />
      {/* Right rocks */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-contain bg-repeat-y" style={{backgroundImage: "url('/placeholder.svg?height=100&width=100')"}} />
      
      <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">Flappy Pierre</h1>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          className="border-4 border-sky-700 rounded-lg shadow-lg"
          aria-label="Jeu Flappy Pierre"
          role="img"
        />
        {gameState !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white rounded-lg">
            <h2 className="text-3xl font-bold mb-4">
              {gameState === 'start' ? 'Flappy Pierre' : 'Game Over'}
            </h2>
            <p className="mb-2 text-xl">Score: {score}</p>
            <p className="mb-4 text-xl">Meilleur Score: {highScore}</p>
            <Button 
              onClick={handleStart} 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              aria-label={gameState === 'start' ? 'Commencer le jeu' : 'Rejouer'}
            >
              {gameState === 'start' ? 'Jouer' : 'Rejouer'}
            </Button>
          </div>
        )}
      </div>
      <p className="mt-6 text-lg text-white">Appuyez sur la touche espace pour faire voler Pierre et commencer/recommencer le jeu !</p>
    </div>
  )
}