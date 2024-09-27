const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true, // ! PENSER À LE PASSER À FALSE À LA FIN
    },
  },
  scene: [],
};

const game = new Phaser.Game(config);
