interface PlayerInterface {
  loadEnvironment(data: any): void,

  setMatrix(matrix: any): any,

  move(direction: string): void,

  stop(): void,

  reset(): void,

  getSquare(): any,

  freeSquare(dx: any, dy: any): boolean,

  animate(context: any): void,
}

 class Player implements PlayerInterface {
  private sprites: any;
  private currentFrame: number;
  private currentMove: string;
  private currentSprite: any;
  private sound: any;
  private matrix: any;
  private readonly height: number;
  private readonly width: number;
  private canvas: any;
  private context: any;
  private positionX: number;
  private positionY: number;
  private fps: number;
  private readonly totalFrame: number;


  public constructor() {
    this.width = 50;
    this.totalFrame = 2;
    this.matrix = null;
    this.currentMove = "";
    this.height = 50;
    this.fps = 0;
    this.positionX = 0;
    this.positionY = 50;
    this.currentFrame = 0;
    this.sound = new Audio();
    this.sprites = {
      top: new Image(),
      bottom: new Image(),
      left: new Image(),
      right: new Image()
    };
    this.canvas = document.getElementById('player');
    this.context = this.canvas.getContext('2d');
    this.canvas.setAttribute('width', window.innerWidth);
    this.canvas.setAttribute('height', window.innerHeight)
  }

  public setMatrix(matrix: any) {
    this.matrix = matrix;
  }

  public reset() {
    this.positionX = 0;
    this.positionY = 50;
    this.currentFrame = 0;
    this.currentMove = "";
    this.move('left');
    this.stop()
  }

  public freeSquare(dx: any, dy: any): boolean {
    const {x, y} = this.getSquare();
    return this.matrix.getCell(y + dx, x + dy)
  }

  public loadEnvironment(data: any) {
    this.sprites.top.src = data.top.default;
    this.sprites.bottom.src = data.bottom.default;
    this.sprites.left.src = data.left.default;
    this.sprites.right.src = data.right.default;
    this.sound.src = data.audio.default;
    this.currentSprite = this.sprites.left;
    this.animate();
  }

  public getSquare() {
    return {
      x: this.positionX / 50,
      y: this.positionY / 50
    }
  }

  public animate() {
    this.sound.play();

    this.context.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight,
    );

    this.context.drawImage(
      this.currentSprite,
      this.width * this.currentFrame,
      0,
      this.width,
      this.height,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );

    if (this.currentFrame == this.totalFrame) {
      this.currentFrame = 0;
    } else {
      this.currentFrame++;
    }

    switch (this.currentMove) {
      case 'top':
        if (!this.freeSquare(-1, 0)) {
          this.stop();
          break
        }
        this.positionY -= 50;
        break;
      case 'bottom':
        if (!this.freeSquare(1, 0)) {
          this.stop();
          break
        }
        this.positionY += 50;
        break;
      case 'right':
        if (!this.freeSquare(0, -1)) {
          this.stop();
          break
        }
        this.positionX -= 50;
        break;
      case 'left':
        if (!this.freeSquare(0, 1)) {
          this.stop();
          break
        }
        this.positionX += 50;
        break;
    }

    this.fps && setTimeout(() => {
      requestAnimationFrame(() => {
        this.animate();
      });
    }, 1000 / this.fps);
  }

  public move(direction: string): void {
    if (this.currentMove != direction) {
      this.currentMove = direction;
      this.currentSprite = this.sprites[direction];
      this.fps = 10;
      this.animate()
    }
  }

  public stop(): void {
    this.fps = 0;
    this.currentMove = ''
  }
}

export default Player
