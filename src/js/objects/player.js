let angle = 0;
let punchNumber = 0;
let canAttack = true;
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setSize(40, 40);
  }

  preload() {}

  create() {
    this.player = this.physics.add.sprite(100, 450, "playerIdle");
    this.player.setCollideWorldBounds(true);
  }

  update(cursors, pointer) {
    let velocityX = 0;
    let velocityY = 0;

    // Vérifier si une touche de déplacement est enfoncée
    if (
      (cursors.left.isDown ||
        cursors.right.isDown ||
        cursors.up.isDown ||
        cursors.down.isDown) &&
      this.texture.key !== "playerPunch1" &&
      this.texture.key !== "playerPunch2"
    ) {
      this.setTexture("playerRun");
    } else if (
      this.texture.key !== "playerPunch1" &&
      this.texture.key !== "playerPunch2"
    ) {
      this.setTexture("playerIdle");
    }

    // Déplacement du joueur
    if (cursors.left.isDown) {
      velocityX = -250;
    } else if (cursors.right.isDown) {
      velocityX = 250;
    }

    if (cursors.up.isDown) {
      velocityY = -250;
    } else if (cursors.down.isDown) {
      velocityY = 250;
    }

    if (pointer.leftButtonDown()) {
      this.Attack("fist");
    }

    // Normaliser la vitesse en diagonale
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= Math.SQRT1_2;
      velocityY *= Math.SQRT1_2;
    }

    // Calculer l'angle vers le curseur de la souris
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY
    );

    this.setAngle((angle * 180) / Math.PI); // Convertir l'angle en degrés
    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);
  }

  Attack(weapon) {
    if (canAttack === false) return;
    canAttack = false;
    switch (weapon) {
      case "fist":
        if (punchNumber === 0) {
          this.setTexture("playerPunch1");
          punchNumber = 1;
        } else if (punchNumber === 1) {
          this.setTexture("playerPunch2");
          punchNumber = 0;
        }
        break;
      case "pistol":
        break;
      case "shotgun":
        break;
      case "rifle":
        break;
      default:
        break;
    }
    setTimeout(() => {
      canAttack = true;
      this.setTexture("playerIdle");
    }, 500);
  }
}
