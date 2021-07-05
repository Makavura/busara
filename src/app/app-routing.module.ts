import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SurveysComponent } from './surveys/surveys.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },{
    path: "profile",
    component: ProfileComponent
  },
  {
    path: "survey",
    component: SurveysComponent
  },
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
