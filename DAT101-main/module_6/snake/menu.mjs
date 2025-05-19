"use strict";

import lib2D from "../../common/libs/lib2d_v2.mjs";
import { SheetData } from "./SheetData.mjs";
import libSprite from "../../common/libs/libSprite_v2.mjs";
import { newGame } from "./game.mjs";

export class TMenu {
  constructor(spriteCanvas) {
    this.sp = spriteCanvas;
    this.visible = false;
    this.showPauseAnim = false;

    this.gameOverBg = new libSprite.TSprite(this.sp, SheetData.GameOver, new lib2D.TPoint(0, 0));
    const canvasWidth = this.sp.canvas.width;
    const canvasHeight = this.sp.canvas.height;
    const menuWidth = SheetData.GameOver.width;
    const menuHeight = SheetData.GameOver.height;
    this.gameOverBg.x = (canvasWidth - menuWidth) / 2;
    this.gameOverBg.y = (canvasHeight - menuHeight) / 2;

    this.gameOverScore = new libSprite.TSpriteNumber(
        this.sp,
        SheetData.Number,
        new lib2D.TPoint(this.gameOverBg.x + 500, this.gameOverBg.y + 200));
    this.gameOverScore.justify = libSprite.ESpriteNumberJustifyType.Left;
    this.gameOverScore.visible = false

    const menuCenterX = 856 / 2;
    const menuBottomY = 400;
    this.btnHome = new libSprite.TSpriteButton(this.sp, SheetData.Home, new lib2D.TPoint(menuCenterX - 335, menuBottomY));
    this.btnRetry = new libSprite.TSpriteButton(this.sp, SheetData.Retry, new lib2D.TPoint(menuCenterX + 215, menuBottomY));
    this.pauseAnim = new libSprite.TSprite(this.sp, SheetData.PauseAnim, new lib2D.TPoint(320, 150));
    this.pauseAnim.animateSpeed = 10;

    this.btnHome.onClick = () => location.reload();
    this.btnRetry.onClick = () => {
      this.visible = false;
      newGame();
    };
    this.btnHome.visible = false;
    this.btnRetry.visible = false;
    this.pauseAnim.visible = false;
  }

  pause() {
    this.visible = true;
    this.showPauseAnim = true;
    this.pauseAnim.visible = true;
    this.btnHome.visible = false;
    this.btnRetry.visible = false
  }

  resume() {
    this.visible = false;
    this.showPauseAnim = false;
    this.pauseAnim.visible = false;
  }

  showGameOverScore(score) {
    this.gameOverScore.value = score;
    this.gameOverScore.visible = true;
  }

  gameOver() {
    this.visible = true;
    this.showPauseAnim = false;
    this.pauseAnim.visible = false;
    this.btnHome.visible = true;
    this.btnRetry.visible = true;
  }

  draw() {
    if (this.showPauseAnim) {
      this.pauseAnim.draw();
    }   if (!this.visible) return;
  
    if (!this.showPauseAnim) {
      this.gameOverBg.draw();
      this.btnHome.draw();
      this.btnRetry.draw();
      this.gameOverScore.draw();
    }
  }
}
