import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpJwtInterceptor } from './http.interceptor';

import { NgxSpinnerModule } from "ngx-spinner";
import { SurveysComponent } from './surveys/surveys.component';

import { TreeModule } from '@circlon/angular-tree-component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    ProfileComponent,
    SurveysComponent
  ],
  imports: [
    BrowserModule,
    NgxSpinnerModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    TreeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpJwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
