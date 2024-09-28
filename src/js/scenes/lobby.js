import Player from "../objects/player.js";
import Ennemies from "../objects/ennemies.js";

export default class Lobby extends Phaser.Scene {
  constructor() {
    super({ key: "Lobby" });
  }

  preload() {
    this.load.image("playerIdle", "src/assets/player/playerIdle.png");
    this.load.image("playerRun", "src/assets/player/playerRun.png");
    this.load.image("playerPunch1", "src/assets/player/playerPunch1.png");
    this.load.image("playerPunch2", "src/assets/player/playerPunch2.png");
    this.load.image("ennemy1Idle", "src/assets/ennemies/ennemy1Idle.png");
    this.load.image("ennemy1Run", "src/assets/ennemies/ennemy1Run.png");
  }

  create() {
    this.player = new Player(this, 100, 450, "playerIdle");
    this.player.setCollideWorldBounds(true);
    this.ennemies = new Ennemies(this, 800, 450, "ennemiesIdle");

    this.cursors = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
    this.pointer = this.input.activePointer;
    this.input.setDefaultCursor(
      "url(src/assets/cursorTarget.png) 16 16, crosshair"
    );

    this.physics.add.overlap(
      this.player.punchZone,
      this.ennemies,
      this.handlePunchCollision,
      null,
      this
    );
  }
  update() {
    if (this.player) {
      this.player.update(this.cursors, this.pointer);
    }
    if (this.ennemies) {
      this.ennemies.update(this.player, this.walls);
    }
  }

  handlePunchCollision(punchZone, enemy) {
    // Détruire l'ennemi lorsqu'il est dans la zone de coup de poing
    if (enemy && enemy.active) {
      enemy.destroy();
    }
  }
}
