import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit } from '@angular/core';
import { ENTER_SCALE, TRANSITION_TEXT, TRANSITION_TEXT_ENTER } from 'src/app/shared/constants/transitions.constants';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  animations: [
    TRANSITION_TEXT,
    TRANSITION_TEXT_ENTER,
    // TRANSITION_AREA_SLIDE,
    // TRANSITION_IMAGE_SCALE,
    ENTER_SCALE
  ]
})
export class BannerComponent implements OnInit {

  _mAnimTextEnded = false
  constructor(public el: ElementRef,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private scroll: ScrollDispatcher, private viewPortRuler: ViewportRuler) { }

  ngOnInit(): void {
  }

  _onTextAnimationEnd($event: any) {
    // console.log("_onTextAnimationEnd", $event['toState'])
    if ($event['toState'] == "in") {
      // console.log("_onTextAnimationEnd")
      this._mAnimTextEnded = true
      // this.animAnimation()
      
    }
  }

}