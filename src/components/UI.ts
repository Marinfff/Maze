import Locale from '../config/locale.json';

 interface UserInterfaceInterface {
  showGameOver(score: number): void,

  toggleLoader(): void,

  confirmGameOver(): Promise<any>,

  confirmGameStart(): Promise<any>,

  hideEndModal (): void
}
 class UserInterface implements UserInterfaceInterface {
  private userInterface: any;
  private showLoader: boolean;
  private showEndModal: boolean;

  public constructor() {
    this.userInterface = document.getElementById('interface');
    this.showLoader = false;
    this.showEndModal = false;
    this.show();
  }

  public showGameOver() {
    this.showEndModal = true;
    this.show();
  }

  public toggleLoader() {
    if (this.showLoader) {
      this.showLoader = false;
      this.hide();
    } else {
      this.showLoader = true;
      this.show();
    }
  }

  public confirmGameOver(): Promise<any> {
    const next: any = document.getElementById('next');
    const exit: any = document.getElementById('exit');

    return new Promise((resolve, reject) => {
      next.addEventListener('click', () => {
        resolve();
      });
      exit.addEventListener('click', () => {
        reject();
      });
    })
  }

  public confirmGameStart(): Promise<any> {
    const start: any = document.getElementById('start');

    return new Promise((resolve) => {
      start.addEventListener('click', () => {
        resolve();
      });
    })
  }

  public hideEndModal () {
    this.showEndModal = false;
    this.hide();
  }

  private hide() {
    this.userInterface.innerHTML = '';
  }

  private show() {
    const width: number = 400;
    const height: number = 75;

    this.userInterface.innerHTML = `
      ${
      this.showLoader
        ? `
      <svg 
        id="preloader" 
        class="preloader" 
        width="68" 
        height="68" 
        viewBox="0 0 38 38" 
        stroke="white"
      >
          <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)" stroke-width="2">
                  <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                  <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 18 18"
                          to="360 18 18"
                          dur="1s"
                          repeatCount="indefinite"/>
                  </path>
              </g>
          </g>
      </svg>
      `
        : `
        <svg
        id="buttons"
        width="${window.innerWidth}"
        height="${window.innerHeight}"
        >
        ${
          !this.showEndModal
            ? `
          <text
             x="50%" 
             class="logo"
             y="${window.innerHeight / 4}" 
             dominant-baseline="middle" 
             text-anchor="middle"
          >
            ${Locale.logo}        
         </text>
        `
            : ``
        }
         <g id="start">
        <rect 
          x="${(window.innerWidth / 2) - width / 2}" 
          y="${window.innerHeight / 2 - 100}" 
          width="${width}" 
          height="${height}" 
          class="rect"
          rx="20"
          stroke-width="3" 
        />
         <text 
           x="50%" 
           y="${window.innerHeight / 2 - 60}" 
           dominant-baseline="middle" 
           text-anchor="middle"
         >
            ${Locale.newGame}
         </text>    
         </g>
      </svg>
      `
    }
      ${
      this.showEndModal
        ? `
        <svg
        width="${window.innerWidth}"
        height="${window.innerHeight}"
        >
         <g>
        <rect 
          x="${(window.innerWidth / 2) - 500 / 2}" 
          y="${window.innerHeight / 2 - 200}" 
          width="500" 
          height="500" 
          class="rect"
          rx="20"
          stroke-width="3" 
        />
         <text 
           x="50%" 
           class="text"
           y="${window.innerHeight / 2 - 160}" 
           dominant-baseline="middle" 
           text-anchor="middle"
         >
          ${Locale.endMessage}
         </text> 
            <text 
              class="text"
               x="50%" 
               y="${window.innerHeight / 2}" 
               dominant-baseline="middle" 
               text-anchor="middle"
         >
           ${Locale.level}: ${2}
         </text>    
        <g id="next">
         <text 
           class="text"
           x="55%" 
           y="${window.innerHeight / 2 + 240}" 
           dominant-baseline="middle" 
           text-anchor="middle"
         >
          ${Locale.next}
         </text>
           </g>
         <g id="exit">
         <text 
           class="text"
           x="45%" 
           y="${window.innerHeight / 2 + 240}" 
           dominant-baseline="middle" 
           text-anchor="middle"
         >
          ${Locale.exit}
         </text>
           </g> 
         </g>
      </svg>
      `
        : ``
    }
    `
  }
}

export default UserInterface
