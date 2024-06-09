import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';
import { HeaderComponent } from './components/header/header.component';
import { MatrizComponent } from './components/matriz/matriz.component';
import { ArrowsComponent } from './components/matriz/arrows/arrows.component';
import { ClassificationsComponent } from './pages/classifications/classifications.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { HomeComponent } from './pages/home/home.component';
import { NavCardComponent } from './pages/home/nav-card/nav-card.component';
import { ClassificatorComponent } from './components/classificator/classificator.component';
import { ClassificatorBadgeComponent } from './components/classificator/classificator-badge/classificator-badge.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    HeaderComponent,
    MatrizComponent,
    ArrowsComponent,
    ClassificationsComponent,
    OperationsComponent,
    HomeComponent,
    NavCardComponent,
    ClassificatorComponent,
    ClassificatorBadgeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
