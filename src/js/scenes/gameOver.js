export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  preload() {
    // Load assets needed for the game over scene
    this.load.image("backgroundGameOver", "src/assets/backgroundGameOver.jpeg");
  }

  create() {
    // Add background image
    this.add.image(512, 384, "backgroundGameOver");
    // Add restart button
    const restartButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 200,
        "Rejouer",
        {
          fontSize: "32px",
          fontFamily: "Rubik",
          fill: "#fff",
          stroke: "#000",
          strokeThickness: 6,
        }
      )
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on("pointerup", () => {
      this.scene.start("Lobby");
    });
  }
}
