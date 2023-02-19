import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon';

import { SharedRoutingModule } from './shared-routing.module';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { RouterModule } from '@angular/router';
import { WidgetWaterfallDirective } from './directives/widget-waterfall.directive';
import { FooterComponent } from './components/footer/footer.component';
import { ButtonModule} from 'primeng/button'

@NgModule({
  declarations: [
    MainContainerComponent,
    WidgetWaterfallDirective,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    ButtonModule,
    RouterModule,
    MatDialogModule,
    SharedRoutingModule
  ],
  exports: []
})
export class SharedModule { }
