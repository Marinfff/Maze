import "./style/style.css"
import config from "./config/config.json"
import Maze from "./components/Maze";
import Player from "./components/Player";
import UserInterface from "./components/UI";

class Game {
  private readonly maze: Maze;
  private config: any;
  private player: Player;
  private userInterface: UserInterface;
  private backSound: HTMLAudioElement;
  private winSound: HTMLAudioElement;

  constructor() {
    this.maze = new Maze();
    this.player = new Player();
    this.userInterface = new UserInterface();
    this.backSound = new Audio();
    this.winSound = new Audio();
    this.config = config;
  }

  public async init() {
    this.backSound.src = (await import(`./assets/${this.config.backSound}`)).default;
    this.winSound.src = (await import(`./assets/${this.config.winSound}`)).default;

    await this.userInterface.confirmGameStart();
    await this.backSound.play();
    this.userInterface.toggleLoader();

    this.maze.setSprite(await import(`./assets/${this.config.box}`))
    await this.player.loadEnvironment({
      top: await import(`./assets/${this.config.playerTop}`),
      left: await import(`./assets/${this.config.playerLeft}`),
      bottom: await import(`./assets/${this.config.playerBottom}`),
      right: await import(`./assets/${this.config.playerRight}`),
      audio: await import(`./assets/${this.config.playerSound}`),
    });

    await this.maze.generate();
    this.player.setMatrix(this.maze);
    this.addListeners();
    this.userInterface.toggleLoader();
  }

  private async upLevel() {
    await this.maze.next();
    this.player.reset();
    this.player.setMatrix(this.maze);
  }

  private async checkEndLevel() {
    if (
      this.maze.getSize().width == this.player.getSquare().x + 3
      && this.maze.getSize().height == this.player.getSquare().y + 3
    ) {

      await this.winSound.play();
      this.userInterface.showGameOver();

      try {
        await this.userInterface.confirmGameOver();
        this.upLevel();
        this.userInterface.hideEndModal();
      } catch {
        window.location.reload();
      }
    }
  }

  private addListeners() {
    document.addEventListener('keypress', (e) => {
      switch (e.code) {
        case 'KeyD':
          this.player.move('left');
          break;
        case 'KeyA':
          this.player.move('right');
          break;
        case 'KeyW':
          this.player.move('top');
          break;
        case 'KeyS':
          this.player.move('bottom');
          break;
      }
    });
    document.addEventListener('keyup', () => {
      this.checkEndLevel();
      this.player.stop()
    })
  }
}

const game = new Game();

game.init();

