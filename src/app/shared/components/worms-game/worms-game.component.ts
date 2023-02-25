import { Component, OnInit, HostListener, ElementRef } from '@angular/core';

interface Missile {
  x: number;
  y: number;
}

@Component({
  selector: 'app-worms-game',
  templateUrl: './worms-game.component.html',
  styleUrls: ['./worms-game.component.scss']
})

export class WormsGameComponent implements OnInit {
  targets = [
    { x: 50, y: 50 },
    { x: 150, y: 50 },
    { x: 250, y: 50 },
    { x: 350, y: 50 },
    { x: 450, y: 50 },
    { x: 550, y: 50 }
  ];
  missiles: Missile[] = [];

  worm = {
    x: 375,
    y: 350,
    vx: 0
  };

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.gameLoop();
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    // Update worm position
    this.worm.x += this.worm.vx;

    // Keep worm inside game container
    if (this.worm.x < 0) {
      this.worm.x = 0;
    } 
    else if (this.worm.x > window.innerWidth - 50) {
      this.worm.x = window.innerWidth - 50;
    }

    // Update missile positions
    this.missiles.forEach(missile => {
      missile.y -= 10;

      // Check for missile-target collision
      this.targets.forEach((target, index) => {
        if (missile.x >= target.x && missile.x <= target.x + 25 && missile.y >= target.y && missile.y <= target.y + 50) {
          this.targets.splice(index, 1);
          this.missiles.splice(this.missiles.indexOf(missile), 1);
        }
      });
    }); 

    // Update target positions
    this.targets.forEach(target => {
      target.y += 2;

      // Check for target-worm collision
      if (target.x >= this.worm.x && target.x <= this.worm.x + 50 && target.y >= this.worm.y && target.y <= this.worm.y + 50) {
        clearInterval(1);
        // alert('Game over!');
      }

      if (target.y > this.worm.y) {
        target.y = -target.y;
      }
    });
  }

  draw() {
    // Draw worm
    const wormEl = this.el.nativeElement.querySelector('.worm');
    wormEl.style.left = this.worm.x + 'px';

    // Draw targets
    const targetEls = this.el.nativeElement.querySelectorAll('.target');

    targetEls.forEach((targetEl: any, index: number) => {
      if (this.targets[index]){
        targetEl.style.left = this.targets[index].x + 'px';
        targetEl.style.top = this.targets[index].y + 'px';
      }

    });

    // Draw missiles
    const missileEls = this.el.nativeElement.querySelectorAll('.missile');
    missileEls.forEach((missileEl: any, index: number) => {
      if (this.missiles[index]){
        missileEl.style.left = this.missiles[index].x + 'px';
        missileEl.style.top = this.missiles[index].y + 'px';
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'ArrowLeft') {
      this.worm.vx = -5;
    } else if (event.code === 'ArrowRight') {
      this.worm.vx = 5;
    } else if (event.code === 'Space') {
      this.missiles.push({
        x: this.worm.x + 30,
        y: 350
      });
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      this.worm.vx = 0;
    }
  }
}
