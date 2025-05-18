"use strict";

//-----------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import libSprite from "../../common/libs/libSprite_v2.mjs";
import lib2D from "../../common/libs/lib2d_v2.mjs";
import { TGameBoard, GameBoardSize, TBoardCell } from "./gameBoard.mjs";
import { TSnake, EDirection } from "./snake.mjs";
import { TBait } from "./bait.mjs";
import { TMenu } from "./menu.mjs";
import { SheetData } from "./SheetData.mjs";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------
const cvs = document.getElementById("cvs");
const spcvs = new libSprite.TSpriteCanvas(cvs);
let gameSpeed = 4; // Game speed multiplier;
let hndUpdateGame = null;
export const EGameStatus = { Idle: 0, Playing: 1, Pause: 2, GameOver: 3 };

// prettier-ignore

export const GameProps = {
  gameBoard: null,
  gameStatus: EGameStatus.Idle,
  snake: null,
  bait: null,
  pause: null,
};

GameProps.spriteCanvas = spcvs;
//------------------------------------------------------------------------------------------
//----------- Exported functions -----------------------------------------------------------
//------------------------------------------------------------------------------------------

export function newGame() {
  GameProps.timer = 10;

  GameProps.timeLeft = new libSprite.TSpriteNumber(spcvs, SheetData.Number, new lib2D.TPoint(10, 10));
  GameProps.timeLeft.justify = libSprite.ESpriteNumberJustifyType.Left;
  GameProps.timeLeft.value = 10;
  GameProps.score = 0;
  GameProps.scoreDisplay = new libSprite.TSpriteNumber(spcvs, SheetData.Number, new lib2D.TPoint(10, 100));
  GameProps.scoreDisplay.justify = libSprite.ESpriteNumberJustifyType.Left;
  GameProps.scoreDisplay.value = 0;

  GameProps.gameStatus = EGameStatus.Playing; // change game status to Playing so the game can start
  GameProps.gameBoard = new TGameBoard();
  GameProps.snake = new TSnake(spcvs, new TBoardCell(5, 5)); // Initialize snake with a starting position
  GameProps.bait = new TBait(spcvs); // Initialize bait with a starting position
  GameProps.pause = new TMenu (spcvs); 
  gameSpeed = 4; // Reset game speed
}

export function bateIsEaten() {
  GameProps.bait.update();

  console.log("Bait eaten!");

  GameProps.snake.grow();
  const bonus = GameProps.timer;
  GameProps.score += bonus * 2;
  GameProps.scoreDisplay.value = GameProps.score;
  GameProps.timer = 10;
  GameProps.timeLeft.value = 10;
  
  increaseGameSpeed(); // Increase game speed
}


//------------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//------------------------------------------------------------------------------------------

function loadGame() {
  cvs.width = GameBoardSize.Cols * SheetData.Head.width;
  cvs.height = GameBoardSize.Rows * SheetData.Head.height;

  GameProps.gameStatus = EGameStatus.Playing; // change game status to Idle

  /* Create the game menu here */ 

  newGame(); // Call this function from the menu to start a new game, remove this line when the menu is ready

  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); // Update game every 1000ms / gameSpeed
  console.log("Game canvas is updating!");
}

function drawGame() {
  spcvs.clearCanvas();

  switch (GameProps.gameStatus) {
    case EGameStatus.Playing:
    case EGameStatus.GameOver:
    case EGameStatus.Pause:
      GameProps.bait.draw();
      GameProps.snake.draw();
      GameProps.timeLeft.drawTransparent(0.5);
      GameProps.scoreDisplay.drawTransparent(0.5);
      break;
  }

  GameProps.pause.draw(); // <- Always draw menu last so it appears on top

  requestAnimationFrame(drawGame);
}

function updateGame() {
  // Update game logic here
  if (GameProps.gameStatus === EGameStatus.Playing) { // Update game logic only when the game is playing
    const now = performance.now();
    if (!GameProps.lastTick) GameProps.lastTick = now;
    if (now - GameProps.lastTick >= 1000) {
      GameProps.lastTick = now;
      if (GameProps.timer > 0) {
        GameProps.timer--;
        GameProps.timeLeft.value = GameProps.timer;
      } else{}
    }
  }

  switch (GameProps.gameStatus) {
    case EGameStatus.Playing:
      if (!GameProps.snake.update()) {
        GameProps.gameStatus = EGameStatus.GameOver;
        GameProps.scoreDisplay.value = GameProps.score;
        
        GameProps.pause.gameOver();
        console.log("Game over!");
      }
      break;
  }
}

function increaseGameSpeed() {
  gameSpeed += 0.02; // Increase game speed
  clearInterval(hndUpdateGame); // Clear the previous interval
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); // Set a new interval with the increased speed
}


//-----------------------------------------------------------------------------------------
//----------- Event handlers --------------------------------------------------------------
//-----------------------------------------------------------------------------------------

export function onKeyDown(event) {
  let togglePause = 0;
  switch (event.key) {
    case "ArrowUp":
      GameProps.snake.setDirection(EDirection.Up);
      break;
    case "ArrowDown":
      GameProps.snake.setDirection(EDirection.Down);
      break;
    case "ArrowLeft":
      GameProps.snake.setDirection(EDirection.Left);
      break;
    case "ArrowRight":
      GameProps.snake.setDirection(EDirection.Right);
      break;
    case " ":
      console.log("togglePause");
      togglePause++;
      if (togglePause = 1 && GameProps.gameStatus == EGameStatus.Playing) {
        GameProps.gameStatus = EGameStatus.Pause;
        GameProps.pause.pause();
      } else if (togglePause = 1 && GameProps.gameStatus == EGameStatus.Pause) {
        GameProps.gameStatus = EGameStatus.Playing;
        GameProps.pause.resume();
      } else if (GameProps.gameStatus == EGameStatus.GameOver) {
        GameProps.gameStatus = EGameStatus.Playing;
        newGame();
      }
      break;
    default:
      console.log(`Key pressed: "${event.key}"`);
  }
}
//-----------------------------------------------------------------------------------------
//----------- main -----------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

spcvs.loadSpriteSheet("./Media/spriteSheet.png", loadGame);
document.addEventListener("keydown", onKeyDown);
