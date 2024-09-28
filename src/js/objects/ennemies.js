export default class Ennemies extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setSize(40, 40);

    // Créer un cône de vision
    this.visionCone = this.scene.add.graphics({
      fillStyle: { color: 0xff0000, alpha: 0.3 },
    });
    this.visionAngle = 60; // Angle du cône de vision en degrés
    this.visionDistance = 200; // Distance du cône de vision

    // Définir la direction initiale de l'ennemi (vers la droite)
    this.direction = Phaser.Math.DegToRad(0); // 0 degrés en radians

    // Ajouter un timer pour changer la direction de l'ennemi à intervalles réguliers
    this.scene.time.addEvent({
      delay: 2000, // Changer de direction toutes les 2 secondes
      callback: this.changeDirection,
      callbackScope: this,
      loop: true,
    });
  }

  preload() {}

  create() {}

  update(player, walls) {
    if (this.active === false) {
      return;
    }
    this.updateVisionCone(player, walls);
    this.updateMovement();
  }

  updateVisionCone(player, walls) {
    this.visionCone.clear();

    const halfVisionAngle = Phaser.Math.DegToRad(this.visionAngle / 2);

    // Définir les points du cône de vision
    const startAngle = this.direction - halfVisionAngle;
    const endAngle = this.direction + halfVisionAngle;

    const points = [];
    points.push(new Phaser.Math.Vector2(this.x, this.y));
    for (
      let angle = startAngle;
      angle <= endAngle;
      angle += Phaser.Math.DegToRad(1)
    ) {
      const x = this.x + Math.cos(angle) * this.visionDistance;
      const y = this.y + Math.sin(angle) * this.visionDistance;
      points.push(new Phaser.Math.Vector2(x, y));
    }

    // Dessiner le cône de vision
    this.visionCone.fillPoints(points, true);

    // Vérifier si le joueur est dans le cône de vision
    const playerInCone = Phaser.Geom.Polygon.ContainsPoint(
      new Phaser.Geom.Polygon(points),
      player
    );

    if (playerInCone) {
      console.log("Player detected!");
      // Vérifier si le joueur est visible (pas bloqué par les murs)
      const ray = new Phaser.Geom.Line(this.x, this.y, player.x, player.y);
      // const intersects = walls
      //   .getChildren()
      //   .some((wall) =>
      //     Phaser.Geom.Intersects.LineToRectangle(ray, wall.getBounds())
      //   );

      // if (!intersects) {
      //   console.log("Player detected!");
      //   // Logique de détection du joueur
      // }
    }
  }

  updateMovement() {
    // Mettre à jour la position de l'ennemi en fonction de la direction
    const speed = 100; // Vitesse de déplacement de l'ennemi
    this.setVelocity(
      Math.cos(this.direction) * speed,
      Math.sin(this.direction) * speed
    );

    // Mettre à jour l'angle de l'ennemi pour qu'il s'oriente vers la direction de déplacement
    this.setAngle((this.direction * 180) / Math.PI); // Convertir l'angle en degrés

    // Mettre à jour l'animation de l'ennemi
    if (this.body.velocity.length() > 0) {
      this.setTexture("ennemy1Run");
    } else {
      this.setTexture("ennemy1Idle");
    }
  }

  changeDirection() {
    // Générer une nouvelle direction aléatoire
    this.direction = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
  }
}
