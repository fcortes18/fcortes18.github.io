import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject, takeUntil, startWith, map, scan, distinctUntilChanged, takeWhile, switchMap, Observable } from 'rxjs';
import { TRANSITION_TEXT, TRANSITION_AREA_SLIDE, TRANSITION_IMAGE_SCALE, ENTER_SCALE } from 'src/app/shared/constants/transitions.constants';
import { UiUtilsView } from 'src/app/shared/utils/views.utils';

import { AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    TRANSITION_TEXT,
    TRANSITION_AREA_SLIDE,
    TRANSITION_IMAGE_SCALE,
    ENTER_SCALE
  ]
})
export class AboutComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  mOnceAnimated = false
 
  /* ********************************************************************************************
  *                anims
  */
  _mTriggerAnim?= 'false'

  _mTriggerImage?= 'false'


  _mThreshold = 0.2

  cAnimated: boolean = false;
  dAnimated: boolean = false;

  // Accessing DOM elements with ViewChild
  //@ViewChild('a') a: any;
  //@ViewChild('b') b: any;
  @ViewChild('c') c: any;
  @ViewChild('d') d: any;
  
  @ViewChild('animRefView') vAnimRefView?: ElementRef<HTMLElement>;
  
  constructor(public el: ElementRef,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private scroll: ScrollDispatcher, private viewPortRuler: ViewportRuler, private render: Renderer2) { }

  ngOnInit(): void {
  }

  
  // ngAfterViewInit is called after the view is initially rendered. @ViewChild() depends on it. You can't access view members before they are rendered.
  ngAfterViewInit(): void {
    this.setupAnimation();

    // Calling the first two animations
    //this.animateValue(this.a, 0, 2021, 1500);
    //this.animateValue(this.b, 0, 16, 1500);

    // Create a scrolling event using Renderer2
    this.render.listen('window', 'scroll', () => {
      // Get element c position
      let cPosition = this.c.nativeElement.getBoundingClientRect();

      // Compare it with the height of the window
      if (cPosition.top >= 0 && cPosition.bottom <= window.innerHeight) {
        // if it has not been animated  yet, animate c
        if (this.cAnimated == false) {
          this.animateValue(this.c, 0, 5, 1500);

          // prevent animation from running again
          this.cAnimated = true;
        }
      }
      // Get element d position
      let dPosition = this.d.nativeElement.getBoundingClientRect();

      // Compare it with the height of the window
      if (dPosition.top >= 0 && dPosition.bottom <= window.innerHeight) {
        // if it has not been animated  yet, animate d
        if (this.dAnimated == false) {
          this.animateValue(this.d, 0, 10, 1500);

          // prevent animation from running again
          this.dAnimated = true;
        }
      }
    });
  }

    // Counter animation fucntion
    animateValue(obj: any, start: number, end: number, duration: number) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        //  Set the actual time
        if (!startTimestamp) startTimestamp = timestamp;
        // Calculate progress (the time versus the set duration)
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Calculate the value compared to the progress and set the value in the HTML
        obj.nativeElement.innerHTML = Math.floor(
          progress * (end - start) + start
        );
        // If progress is not 100%, an call a new animation of step
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      // Call a last animation of step
      window.requestAnimationFrame(step);
    }

  ngOnDestroy(): void {
    
    this.destroyed$.next(true)
    this.destroyed$.complete()
  }


  public setupAnimation() {
    if (!this.vAnimRefView) return;

    // console.info("home products setupAnimation: " )
    this.scroll.ancestorScrolled(this.vAnimRefView, 100).pipe(
      // Makes sure to dispose on destroy
      takeUntil(this.destroyed$),
      startWith(0),
      map(() => {
        if (this.vAnimRefView != null) {
          var visibility = UiUtilsView.getVisibility(this.vAnimRefView, this.viewPortRuler)
          // console.log("product app-item UiUtilsView visibility: ", visibility)
          return visibility;
        }
        return 0;

      }),
      scan<number, boolean>((acc: number | boolean, val: number) => (val >= this._mThreshold || (acc ? val > 0 : false))),
      // Distincts the resulting triggers 
      distinctUntilChanged(),
      // Stop taking the first on trigger when aosOnce is set
      takeWhile(trigger => {
        // console.info("app-item  !trigger || !this.mOnceAnimated",
        //   !trigger || !this.mOnceAnimated)

        return !trigger || !this.mOnceAnimated
      }, true),
      switchMap(trigger => new Observable<number | boolean>(observer => this._ngZone.run(() => observer.next(trigger))))
    ).subscribe(val => {


      // console.log("home-item setupAnimation ancestorScrolled: ", val)

      if (this.mOnceAnimated) {
        return;
      }

      if (val) {
        // console.log("HomeProductsComponent setupAnimation setupAnimation ancestorScrolled: ", val)

        this.mOnceAnimated = true
        this._mTriggerAnim = 'true'
        this.cdr.detectChanges()
      }
      // if (this.vImageArea != null) {
      //   var visibility = UiUtilsView.getVisibility(this.vImageArea, this.viewPortRuler)
      //   console.log("UiUtilsView visibility: ", visibility)
      // }
    }

    )
  }

}