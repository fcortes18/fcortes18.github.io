import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { BannerComponent } from './components/banner/banner.component';
import { AboutComponent } from './components/about/about.component';
import { MatCardModule} from '@angular/material/card'
import { MatGridListModule} from '@angular/material/grid-list'
import { MatListModule} from '@angular/material/list'
import { ImageModule} from 'primeng/image'
import { ButtonModule} from 'primeng/button'
import {DividerModule} from 'primeng/divider';
import { CardModule} from 'primeng/card'

@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    MatCardModule,
    MatGridListModule,
    MatListModule,
    ImageModule,
    ButtonModule,
    DividerModule,
    CardModule
  ]
})
export class HomeModule { }
