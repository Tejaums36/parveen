let highestZ = 1;

class Paper {
  constructor(paper) {
    this.paper = paper;
    this.holdingPaper = false;
    this.rotating = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchMoveX = 0;
    this.touchMoveY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;

    this.init();
  }

  handleMove(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (!this.rotating) {
      this.touchMoveX = clientX;
      this.touchMoveY = clientY;

      this.velX = this.touchMoveX - this.prevTouchX;
      this.velY = this.touchMoveY - this.prevTouchY;
    }

    const dirX = clientX - this.touchStartX;
    const dirY = clientY - this.touchStartY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (180 * angle) / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;

    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevTouchX = this.touchMoveX;
      this.prevTouchY = this.touchMoveY;

      this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  handleStart(e) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    this.paper.style.zIndex = highestZ;
    highestZ += 1;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    this.touchStartX = clientX;
    this.touchStartY = clientY;
    this.prevTouchX = this.touchStartX;
    this.prevTouchY = this.touchStartY;

    if (e.touches && e.touches.length > 1) {
      this.rotating = true;
    }
  }

  handleEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  init() {
    this.paper.addEventListener('mousedown', (e) => this.handleStart(e));
    this.paper.addEventListener('mousemove', (e) => this.handleMove(e));
    this.paper.addEventListener('mouseup', () => this.handleEnd());

    this.paper.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
    this.paper.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
    this.paper.addEventListener('touchend', () => this.handleEnd());

    // Gesture handling for mobile rotation
    this.paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    this.paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

document.querySelectorAll('.paper').forEach(paper => {
  new Paper(paper);
});
