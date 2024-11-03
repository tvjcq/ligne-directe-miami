import Player from "../objects/player.js";
// import Ennemies from "../objects/ennemies.js";
import Ennemy1 from "../objects/ennemy1.js";

export default class Lobby extends Phaser.Scene {
  constructor() {
    super({ key: "Lobby" });
    this.playerHealth = 3;
    this.score = 0;
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
    this.load.image("weapon", "src/assets/weapon.png");
    this.load.image("projectile", "src/assets/projectile.png");

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

    // Créer le joueur
    this.player = new Player(this, 500, 450, "playerIdle");

    // Suivre le joueur avec la caméra
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // this.ennemies = new Ennemies(this, 800, 450, "ennemy1Idle");
    this.ennemies = this.physics.add.group();
    this.ennemies.add(new Ennemy1(this, 800, 600, "ennemy1Idle"));
    this.ennemies.add(new Ennemy1(this, 950, 750, "ennemy1Idle"));
    this.ennemies.add(new Ennemy1(this, 900, 320, "ennemy1Idle"));
    this.ennemies.add(new Ennemy1(this, 800, 200, "ennemy1Idle"));

    this.physics.add.overlap(
      this.player,
      this.ennemies,
      this.handlePlayerCollision,
      null,
      this
    );

    // Ajouter une arme au sol
    this.weapon = this.physics.add.sprite(1100, 500, "weapon").setRotation(0.5);
    this.physics.add.overlap(
      this.player,
      this.weapon,
      this.handleWeaponPickup,
      null,
      this
    );

    // Gérer les collisions entre les projectiles et les ennemis
    this.physics.add.overlap(
      this.player.projectiles,
      this.ennemies,
      this.handleProjectileCollision,
      null,
      this
    );

    // Gérer les collisions entre les projectiles et les murs
    this.physics.add.collider(
      this.player.projectiles,
      walls,
      (projectile, wall) => {
        projectile.destroy();
      }
    );

    // Texte pour afficher la vie du joueur
    this.healthText = this.add.text(16, 16, `Vie: ${this.playerHealth}`, {
      fontSize: "24px",
      fontFamily: "Rubik",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 6,
    });
    this.healthText.setScrollFactor(0);

    // Texte pour afficher le score
    this.scoreText = this.add.text(16, 48, `Score: ${this.score}`, {
      fontSize: "24px",
      fontFamily: "Rubik",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 6,
    });
    this.scoreText.setScrollFactor(0);

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
      this.score += 100;
      this.scoreText.setText(`Score: ${this.score}`);
      enemy.destroy();
    }
  }

  handleWeaponPickup(player, weapon) {
    player.pickUpWeapon(weapon);
  }

  handlePlayerCollision(player, enemy) {
    // Détruire le joueur lorsqu'il est touché par un ennemi
    if (player && player.active && this.playerHealth > 0) {
      this.playerHealth -= 1;
      if (this.score - 50 >= 0) {
        this.score -= 50;
      }
      this.scene.restart();
    } else {
      this.playerHealth = 3;
      this.score = 0;
      this.scene.start("GameOver");
    }
  }

  handleProjectileCollision(projectile, enemy) {
    // Détruire l'ennemi et le projectile lorsqu'ils se touchent
    if (enemy && enemy.active) {
      this.score += 100;
      this.scoreText.setText(`Score: ${this.score}`);
      enemy.destroy();
      projectile.destroy();
    }
  }
}
