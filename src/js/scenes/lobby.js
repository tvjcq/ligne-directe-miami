import Player from "../objects/player.js";

export default class Lobby extends Phaser.Scene {
  constructor() {
    super({ key: "Lobby" });
  }

  preload() {
    this.load.image("playerIdle", "src/assets/player/playerIdle.png");
    this.load.image("playerRun", "src/assets/player/playerRun.png");
    this.load.image("playerPunch1", "src/assets/player/playerPunch1.png");
    this.load.image("playerPunch2", "src/assets/player/playerPunch2.png");
  }

  create() {
    this.player = new Player(this, 100, 450, "playerIdle");

    this.cursors = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.pointer = this.input.activePointer;
    this.input.setDefaultCursor("url(src/assets/cursorTarget.cur), crosshair");
  }
  update() {
    if (this.player) {
      this.player.update(this.cursors, this.pointer);
    }
  }
}
