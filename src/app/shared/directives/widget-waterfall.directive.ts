import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, Directive, ElementRef, Inject, Input, NgZone, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, filter, fromEvent } from 'rxjs';

@Directive({
  selector: '[appWidgetWaterfall]'
})
export class WidgetWaterfallDirective implements OnChanges, OnDestroy, AfterContentInit, AfterViewChecked {

  private mClassActive?: string;
  private document: Document;
  private scrollListener?: Function;
  private _mOffsetY: number = 0;
  private mRefTarget: any;
  private _mIsActive: boolean = false;
  private _mIsActivePrev: boolean = false;
  mLink: any;
  _mLinkedElement: any;
  mRouteChanged: boolean = false;

  @Input()
  set waterfallActiveClass(data: string) {
    this.mClassActive = data;
  }

  @Input()
  set waterfallReferenceTarget(target: HTMLElement) {
    if (target !== this.mRefTarget) {
      this.mRefTarget = target ? target : this._platform.isBrowser ? window : undefined;
      this._initScrollHandler();
    }
  }

  @Input()
  set waterfallReferenceLink(data: string) {
    const link = Array.isArray(data) ? data[0] : data.split(" ")[0];
    this.mLink = link;
    setTimeout(() => this._updateRefLink())
  }

  @Input()
  set waterfallOffsetRef(ref: ElementRef) {
    if (ref.nativeElement.offsetHeight && ref.nativeElement.offsetHeight > 0) {
      this._mOffsetY = ref.nativeElement.offsetHeight;
    } else {
      this._mOffsetY = 2;
    }
  }

  private _scrollTargetSubscription?: Subscription;
  subscriptions: Subscription[] = [];

  _mCurrentState = "0we9wewew";
  constructor(
    private renderer: Renderer2,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _ngZone: NgZone,
    private el: ElementRef,
    private _platform: Platform,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) document: any) {
    this.document = <Document>document;
  }

  ngAfterContentInit() {
    this.subscriptions.push(this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((val) => {
      let routePath = this.location.path();

      if (this._mCurrentState != routePath) {
        this._mCurrentState = routePath
        setTimeout(() => this._updateRefLink())
      }
    }))
  }

  ngAfterViewChecked() {
  }

  ngOnDestroy(): void {
    this._scrollTargetSubscription?.unsubscribe();
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  private _updateRefLink() {
    if (this.mLink) {
      if (this._scrollTargetSubscription != null) this._scrollTargetSubscription.unsubscribe()
      this._mLinkedElement = this.document.getElementById(this.mLink);

      this._initScrollHandler();
    }
  }

  private _initScrollHandler(): void {
    if (this._scrollTargetSubscription) {
      this._scrollTargetSubscription.unsubscribe();
    }
    if (!this._platform.isBrowser) {
      return;
    }

    this._scrollTargetSubscription = this._ngZone.runOutsideAngular(() =>
      fromEvent<Event>(this.mRefTarget || window, 'scroll')
        .subscribe((event) => this._ngZone.run(() => {
          this.doSomethingTarget(event)
        })));
  }

  doSomethingTarget(event: any) {
    this.checkForChangesTarget(this.mRefTarget.scrollTop);
    this.updateForTarget();
  }

  private checkForChangesTarget(pageYOffset: any) {
    let positionY = pageYOffset;
    if (this._mLinkedElement) {
      let offsetTop = this._mLinkedElement.offsetTop;
      let offsetBottom = this._mLinkedElement.offsetHeight + offsetTop;

      if (offsetTop + this._mOffsetY < positionY && offsetBottom > positionY) {
        this._mIsActive = true;
      } else {
        this._mIsActive = false;
      }
    } else
      if (this.mRefTarget) {
        let offsetTop = this.mRefTarget.offsetTop;
        let offsetBottom = this.mRefTarget.offsetHeight + offsetTop;
        if (offsetTop + this._mOffsetY < positionY) {
          this._mIsActive = true;
        } else {
          this._mIsActive = false;
        }
      }
  }

  private updateForTarget(): void {
    if (!this.mRefTarget) return;

    if (this._mIsActivePrev !== this._mIsActive) {
      this._mIsActivePrev = this._mIsActive;
      if (!this.mClassActive) {
        return;
      }

      if (this._mIsActive) {
        this.addClass(this.mClassActive)
      } else {
        this.removeClass(this.mClassActive)
      }
      this.cdr.detectChanges();
    }
  }

  private addClass(classNames: string) {
    let classes = classNames.split(' ');
    classes.forEach(
      c => this.renderer.addClass(this.el.nativeElement, c));
  }

  private removeClass(classNames: string) {
    let classes = classNames.split(' ');

    classes.forEach(
      c => this.renderer.removeClass(this.el.nativeElement, c));
  }
}