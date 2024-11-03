export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "Menu" });
  }

  preload() {
    // Charger les assets nécessaires pour le menu
    this.load.image("background", "src/assets/background.jpeg");
    this.load.image("playButton", "src/assets/playButton.png");
  }

  create() {
    // Ajouter l'image de fond
    this.add.image(512, 384, "background");
    // Ajouter un texte de titre
    this.add
      .text(this.cameras.main.centerX, 100, "Ligne Directe Miami", {
        fontSize: "48px",
        fontFamily: "Rubik",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Ajouter un bouton "Jouer"
    const playButton = this.add
      .image(this.cameras.main.centerX, this.cameras.main.centerY, "playButton")
      .setInteractive();

    // Ajouter un événement de clic sur le bouton "Jouer"
    playButton.on("pointerup", () => {
      this.scene.start("Lobby");
    });
  }
}
