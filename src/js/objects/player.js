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
    this.weapon = null;
    this.projectiles = this.scene.physics.add.group(); // Ajouter un groupe pour les projectiles
    this.lastShotTime = 0; // Ajouter une propriété pour le temps du dernier tir
    this.shootCooldown = 100; // Ajouter une propriété pour le délai entre les tirs (en millisecondes)

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

    if (pointer.leftButtonDown()) {
      if (this.weapon) {
        this.shoot(pointer.worldX, pointer.worldY);
      } else {
        this.Attack();
      }
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

  Attack() {
    if (this.canAttack === false) return;
    this.canAttack = false;

    this.punchZone.body.enable = true;
    if (this.punchNumber === 0) {
      this.setTexture("playerPunch1");
      this.punchNumber = 1;
    } else if (this.punchNumber === 1) {
      this.setTexture("playerPunch2");
      this.punchNumber = 0;
    }

    setTimeout(() => {
      this.punchZone.body.enable = false;
    }, 200);
    setTimeout(() => {
      this.canAttack = true;
      this.setTexture("playerIdle");
    }, 500);
  }

  shoot(targetX, targetY) {
    const currentTime = this.scene.time.now;
    if (currentTime - this.lastShotTime < this.shootCooldown) {
      return; // Ne pas tirer si le délai entre les tirs n'est pas écoulé
    }

    this.lastShotTime = currentTime; // Mettre à jour le temps du dernier tir

    const projectile = this.scene.physics.add.sprite(
      this.x,
      this.y,
      "projectile"
    );

    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    projectile.setScale(0.05);
    projectile.setRotation(angle);
    this.projectiles.add(projectile);
    const speed = 500;
    this.scene.physics.velocityFromRotation(
      angle,
      speed,
      projectile.body.velocity
    );

    projectile.body.onWorldBounds = true;
    projectile.body.world.on("worldbounds", (body) => {
      if (body.gameObject === projectile) {
        projectile.destroy();
      }
    });
  }

  pickUpWeapon(weapon) {
    this.weapon = weapon;
    weapon.destroy(); // Supprimer l'arme du sol
  }
}
