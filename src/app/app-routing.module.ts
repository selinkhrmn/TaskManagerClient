import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent, SidenavComponent, TabsComponent } from './components';

export const routes: Routes = [

  {
    path: "",
    component: NavbarComponent
  },
  {
    path: "sidenav",
    component: SidenavComponent
  },
  {
    path: "tabs",
    component: TabsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
