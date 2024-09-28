export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setSize(40, 40);

    this.punchNumber = 0;
    this.canAttack = true;

    this.punchZone = this.scene.add.rectangle(0, 0, 50, 50);
    this.scene.physics.add.existing(this.punchZone);
    this.punchZone.body.setAllowGravity(false);
    this.punchZone.body.setImmovable(true);
    this.punchZone.body.enable = false;
  }

  preload() {}

  create() {}

  update(cursors, pointer) {
    let velocityX = 0;
    let velocityY = 0;

    // Vérifier si une touche de déplacement est enfoncée

    // Déplacement du joueur
    if (cursors.left.isDown && cursors.right.isDown) {
      velocityX = 0;
    } else if (cursors.left.isDown) {
      velocityX = -250;
    } else if (cursors.right.isDown) {
      velocityX = 250;
    }
    if (cursors.up.isDown && cursors.down.isDown) {
      velocityY = 0;
    } else if (cursors.up.isDown) {
      velocityY = -250;
    } else if (cursors.down.isDown) {
      velocityY = 250;
    }

    if (velocityX === 0 && velocityY === 0) {
      if (
        this.texture.key !== "playerPunch1" &&
        this.texture.key !== "playerPunch2"
      ) {
        this.setTexture("playerIdle");
      }
    } else {
      if (
        this.texture.key !== "playerPunch1" &&
        this.texture.key !== "playerPunch2"
      ) {
        this.setTexture("playerRun");
      }
    }

    if (pointer.leftButtonDown() || cursors.space.isDown) {
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

    this.updatePunchZone();
  }

  updatePunchZone() {
    const offsetX = Math.cos(Phaser.Math.DegToRad(this.angle)) * 25;
    const offsetY = Math.sin(Phaser.Math.DegToRad(this.angle)) * 25;
    this.punchZone.setPosition(this.x + offsetX, this.y + offsetY);
    this.punchZone.setRotation(Phaser.Math.DegToRad(this.angle));
  }

  Attack(weapon) {
    if (this.canAttack === false) return;
    this.canAttack = false;
    switch (weapon) {
      case "fist":
        this.punchZone.body.enable = true;
        if (this.punchNumber === 0) {
          this.setTexture("playerPunch1");
          this.punchNumber = 1;
        } else if (this.punchNumber === 1) {
          this.setTexture("playerPunch2");
          this.punchNumber = 0;
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
      this.punchZone.body.enable = false;
    }, 200);
    setTimeout(() => {
      this.canAttack = true;
      this.setTexture("playerIdle");
    }, 500);
  }
}
