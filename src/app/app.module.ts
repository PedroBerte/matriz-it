import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';
import { HeaderComponent } from './components/header/header.component';
import { MatrizComponent } from './components/matriz/matriz.component';
import { MatrizHeaderComponent } from './components/matriz/matriz-header/matriz-header.component';
import { MatrizBodyComponent } from './components/matriz/matriz-body/matriz-body.component';
import { ArrowsComponent } from './components/matriz/matriz-body/arrows/arrows.component';
import { ClassificationsComponent } from './pages/classifications/classifications.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { HomeComponent } from './pages/home/home.component';
import { NavCardComponent } from './pages/home/nav-card/nav-card.component';
import { InputCellComponent } from './components/matriz/matriz-body/input-cell/input-cell.component';
import { ClassificatorComponent } from './components/classificator/classificator.component';
import { ClassificatorBadgeComponent } from './components/classificator/classificator-badge/classificator-badge.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    HeaderComponent,
    InputCellComponent,
    MatrizComponent,
    MatrizHeaderComponent,
    MatrizBodyComponent,
    ArrowsComponent,
    ClassificationsComponent,
    OperationsComponent,
    HomeComponent,
    NavCardComponent,
    ClassificatorComponent,
    ClassificatorBadgeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
