import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WormsGameComponent } from './worms-game.component';

describe('WormsGameComponent', () => {
  let component: WormsGameComponent;
  let fixture: ComponentFixture<WormsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WormsGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WormsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
