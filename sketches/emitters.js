class Emitter {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.particles = [];
  }

  emit(num) {
    for (let i = 0; i < num; i++) {
      this.particles.push(new Particle(this.position.x, this.position.y));
    }
  }

  update() {
    for (let particle of this.particles) {
      particle.update();
    }

    this.particles = this.particles.filter((p) => !p.finished());
  }

  show() {
    for (let particle of this.particles) {
      particle.show();
    }
  }
}
