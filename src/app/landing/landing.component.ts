import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  isLoggedIn: Boolean;

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

}
