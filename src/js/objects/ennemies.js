export default class Ennemies extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    // Appeler le constructeur de la classe parent
    super(scene, x, y, texture);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setSize(40, 40);

    // Créer le cône de vision
    this.visionCone = this.scene.add.graphics({
      fillStyle: { color: 0xff0000, alpha: 0.3 },
    });
    this.visionAngle = 60; // Angle du cône de vision en degrés
    this.visionDistance = 400; // Distance du cône de vision

    // Initialiser les variables de l'ennemi
    this.playerDetected = false;

    // Définir la direction initiale de l'ennemi (vers la droite)
    this.direction = Phaser.Math.DegToRad(0); // 0 degrés en radians
    this.changeDirectionInProgress = false; // Nouvelle propriété

    // Ajouter un timer pour changer la direction de l'ennemi à intervalles réguliers
  }

  preload() {}

  create() {}

  update(player, walls) {
    // Vérifier si l'ennemi est actif
    if (this.active === false) {
      return;
    }

    this.updateVisionCone(player, walls);
    this.updateMovement(player);
  }

  updateVisionCone(player, walls) {
    this.visionCone.clear();

    // Calculer les points du cône de vision
    const halfVisionAngle = Phaser.Math.DegToRad(this.visionAngle / 2);

    // Définir les points du cône de vision
    const startAngle = this.direction - halfVisionAngle;
    const endAngle = this.direction + halfVisionAngle;

    // Calculer le point de départ légèrement derrière l'ennemi
    const offsetDistance = 10; // Ajustez cette valeur selon vos besoins
    const startX = this.x - Math.cos(this.direction) * offsetDistance;
    const startY = this.y - Math.sin(this.direction) * offsetDistance;

    // Créer les points du cône de vision
    const points = [];
    points.push(new Phaser.Math.Vector2(startX, startY));
    for (
      let angle = startAngle;
      angle <= endAngle;
      angle += Phaser.Math.DegToRad(1)
    ) {
      const x = startX + Math.cos(angle) * this.visionDistance;
      const y = startY + Math.sin(angle) * this.visionDistance;
      points.push(new Phaser.Math.Vector2(x, y));
    }

    // Vérifier si le joueur est dans le cône de vision
    const playerInCone = Phaser.Geom.Polygon.ContainsPoint(
      new Phaser.Geom.Polygon(points),
      player
    );

    if (playerInCone) {
      // Vérifier si le joueur est visible (pas bloqué par les murs)
      const ray = new Phaser.Geom.Line(startX, startY, player.x, player.y);
      const intersects = this.checkRayAgainstWalls(ray, walls);

      if (!intersects) {
        this.playerDetected = true;
        console.log("Player detected!");
      } else {
        this.playerDetected = false;
      }
    } else {
      this.playerDetected = false;
    }
  }

  checkRayAgainstWalls(ray, walls) {
    const tiles = walls.getTilesWithinShape(ray);
    return tiles.some((tile) => tile.index !== -1);
  }

  updateMovement(player) {
    if (this.playerDetected) {
      this.moveToPlayer(player);
      if (this.timerDirection) {
        this.timerDirection.paused = true; // Mettre en pause le changement de direction
      }
    } else {
      if (this.timerDirection) {
        this.timerDirection.paused = false; // Relancer le changement de direction
      }
      this.randomMovement();
    }
  }

  moveToPlayer(player) {
    // Méthode à surcharger dans les classes enfants
    throw new Error(
      "moveToPlayer() doit être surchargée dans les classes enfants"
    );
  }

  randomMovement() {
    // Mettre à jour la position de l'ennemi en fonction de la direction
    const speed = 100; // Vitesse de déplacement de l'ennemi
    this.setVelocity(
      Math.cos(this.direction) * speed,
      Math.sin(this.direction) * speed
    );

    if (!this.changeDirectionInProgress) {
      this.changeDirectionInProgress = true; // Marquer le changement de direction en cours
      this.timerDirection = this.scene.time.addEvent({
        delay: 2000, // 5 secondes
        callback: () => {
          this.changeDirection();
          this.changeDirectionInProgress = false; // Réinitialiser la propriété
        },
        callbackScope: this,
        loop: false,
      });
    }
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
