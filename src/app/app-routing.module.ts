import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ClassificationsComponent } from './pages/classifications/classifications.component';
import { OperationsComponent } from './pages/operations/operations.component';

export const routes: Routes = [{
  title: "Home",
  path: "",
  component: HomeComponent
},
{
  title: "Classificações",
  path: "classifications",
  component: ClassificationsComponent
},
{
  title: "Operações",
  path: "operations",
  component: OperationsComponent
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
