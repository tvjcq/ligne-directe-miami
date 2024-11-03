import Menu from "./scenes/menu.js";
import Lobby from "./scenes/lobby.js";
import GameOver from "./scenes/gameOver.js";

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
      debug: false, // ! PENSER À LE PASSER À FALSE À LA FIN
    },
  },
  scene: [Menu, Lobby, GameOver],
};

const game = new Phaser.Game(config);
