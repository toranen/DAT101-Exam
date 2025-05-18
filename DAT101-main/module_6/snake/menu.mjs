"use strict";

import { SheetData, GameProps ,newGame, onKeyDown } from "./game.mjs";
import libSprite from "../../common/libs/libSprite_v2.mjs";
import lib2D from "../../common/libs/lib2d_v2.mjs";
/* Use this file to create the menu for the snake game. */

const cvs = document.getElementById("cvs");

export class TMenu {
    #overlay = false;
    #home = false;
    #retry = false;
    #resume = false;
    #score = false;
    #gameOver = false;
    #pause = false;
    
    static GameStatus = {
        Idle: 0,
        Playing: 1,
        Pause: 2,
        GameOver: 3
    }

    constructor(aSpriteCanvas) {
        this.#home = new libSprite.TSprite(aSpriteCanvas, SheetData.Home, new lib2D.TPoint(0, 0));
        this.#retry = new libSprite.TSprite(aSpriteCanvas, SheetData.Retry, new lib2D.TPoint(0, 0));
        this.#resume = new libSprite.TSprite(aSpriteCanvas, SheetData.Resume, new lib2D.TPoint(0, 0));
        this.#score = new libSprite.TSprite(aSpriteCanvas, SheetData.Number, new lib2D.TPoint(0, 0));
        this.#gameOver = new libSprite.TSprite(aSpriteCanvas, SheetData.GameOver, new lib2D.TPoint(0, 0));
        this.#overlay = new libSprite.TSprite(aSpriteCanvas, SheetData.Play, new lib2D.TPoint(0, 0));
    }

    pause() {
        this.#pause = true;
    }

    resume(){
        this.#pause = false;
    }

    overlayPaused() {
        switch (this.#pause) {
            case true:
                this.GameStatus = GameStatus.Pause;
                this.#overlay = true;
                console.log("Overlay paused");
                break;
            case false:
                this.GameStatus = GameStatus.Playing;
                this.#overlay = false;
                console.log("Overlay playing");
                break;
        }
    }

    home(){
        this.GameStatus = TMenu.GameStatus.Idle;
    }

    retry(){
        this.GameStatus = TMenu.GameStatus.Playing;
    }

    score(){

    }



}