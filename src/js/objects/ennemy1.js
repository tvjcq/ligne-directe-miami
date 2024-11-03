import Ennemies from "./ennemies.js";

export default class Ennemy1 extends Ennemies {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }

  // Vous pouvez surcharger les méthodes de la classe parente si nécessaire
  update(player, walls) {
    super.update(player, walls);
    if (this.playerDetected) {
      this.moveToPlayer(player);
    }
  }

  moveToPlayer(player) {
    console.log("Move to player");

    // Calculer l'angle vers le joueur
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.direction = angle; // Mettre à jour la direction de l'ennemi

    // Déplacer l'ennemi vers le joueur
    this.scene.physics.moveTo(this, player.x, player.y, 175);

    // Mettre à jour l'angle de l'ennemi pour qu'il s'oriente vers la direction de déplacement
    this.setAngle((this.direction * 180) / Math.PI); // Convertir l'angle en degrés

    // Mettre à jour l'animation de l'ennemi
    if (this.body.velocity.length() > 0) {
      this.setTexture("ennemy1Run");
    } else {
      this.setTexture("ennemy1Idle");
    }
  }
}
