"use strict";

import libSprite from "../../common/libs/libSprite_v2.mjs";
import lib2D from "../../common/libs/lib2d_v2.mjs";
import "SheetData, GameStatus, GameProps" from './game.mjs'
import "spriteSheet" from './media/spritesheet.png'

/* Use this file to create the menu for the snake game. */

export class Menu {
    #ButtonPlay;
    #buttonExit;
    #buttonRestart;
    #buttonPause;
    #buttonResume;
    #buttonContinue;
    #buttonHome;
    constructor(aSpriteCanvas) {
        this.gameStatus = GameStatus.Idle;
        this.gameProps = new GameProps();
        this.spriteSheet = new libSprite.SpriteSheet(spriteSheet, 32, 32);
        this.#ButtonPlay = SheetData.Play;
        this.#buttonExit = SheetData.Home;
        this.#buttonRestart = SheetData.Retry;
        this.#buttonResume = SheetData.Resume;
        this.spriteSheet.load().then(() => {
            this.drawMenu();
        });
    } // End of constructor
    drawMenu() {
        if (addEventListener === "space"){
            this.gameStatus = gameStatus.pause;
        }

        lib2D.clear();
        lib2D.drawImage(this.spriteSheet.getSprite(0), 0, 0);
        lib2D.drawText("Snake Game", 100, 50);
        lib2D.drawText("Press Enter to Start", 100, 100);
    }

    update() {
        if (this.gameStatus === GameStatus.Idle) {
            this.drawMenu();
        } else if (this.gameStatus === GameStatus.Playing) {
            this.gameProps.update();
        }
    }