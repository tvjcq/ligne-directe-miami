import Player from "../objects/player.js";
// import Ennemies from "../objects/ennemies.js";
import Ennemy1 from "../objects/ennemy1.js";

export default class Lobby extends Phaser.Scene {
  constructor() {
    super({ key: "Lobby" });
  }

  preload() {
    // Charger les assets de la map
    this.load.tilemapTiledJSON("map", "src/assets/map/map.json");
    this.load.image("tileset", "src/assets/map/tilesheet.png");

    // Charger les assets joueur
    this.load.image("playerIdle", "src/assets/player/playerIdle.png");
    this.load.image("playerRun", "src/assets/player/playerRun.png");
    this.load.image("playerPunch1", "src/assets/player/playerPunch1.png");
    this.load.image("playerPunch2", "src/assets/player/playerPunch2.png");

    // Charger les assets ennemis
    this.load.image("ennemy1Idle", "src/assets/ennemies/ennemy1Idle.png");
    this.load.image("ennemy1Run", "src/assets/ennemies/ennemy1Run.png");
  }

  create() {
    // Créer la map
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileset");
    const ground = map.createLayer("Ground", tileset);
    const walls = map.createLayer("Walls", tileset);
    const doors = map.createLayer("Doors", tileset);

    // Définir les collisions
    walls.setCollisionByProperty({ collides: true });

    // Définir les limites du monde et de la caméra
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Afficher les collisions à l'écran
    // ! À retirer
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    walls.renderDebug(debugGraphics, {
      tileColor: null, // Pas de couleur pour les tuiles sans collision
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Couleur des tuiles avec collision
    });

    // Créer le joueur
    this.player = new Player(this, 500, 450, "playerIdle");

    // Suivre le joueur avec la caméra
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // this.ennemies = new Ennemies(this, 800, 450, "ennemy1Idle");
    this.ennemies = this.physics.add.group();
    this.ennemies.add(new Ennemy1(this, 800, 600, "ennemy1Idle"));
    this.ennemies.add(new Ennemy1(this, 950, 750, "ennemy1Idle"));

    // Gérer les contrôles
    this.cursors = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    // Gérer la souris
    this.pointer = this.input.activePointer;

    // Changer le curseur de la souris
    this.input.setDefaultCursor(
      "url(src/assets/cursorTarget.png) 16 16, crosshair"
    );

    // Gérer les collisions
    this.walls = walls;
    this.physics.add.collider(this.player, walls);
    this.physics.add.collider(this.ennemies, walls);

    // Gérer les collisions avec la zone de coup de poing
    this.physics.add.overlap(
      this.player.punchZone,
      this.ennemies,
      this.handlePunchCollision,
      null,
      this
    );

    this.map = map;
  }
  update() {
    if (this.player) {
      this.player.update(this.cursors, this.pointer);
    }
    if (this.ennemies) {
      this.ennemies.children.iterate((ennemy) => {
        ennemy.update(this.player, this.walls);
      });
    }
  }

  handlePunchCollision(punchZone, enemy) {
    // Détruire l'ennemi lorsqu'il est dans la zone de coup de poing
    if (enemy && enemy.active) {
      enemy.destroy();
    }
  }
}
