import { Component } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Busara';

  
  constructor(private authService: AuthenticationService) {
    this.isLoggedIn = this.authService.isLoggedIn();
   }

  isLoggedIn: Boolean;

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

  }

  signOut(){
    this.authService.logout();
  }
}
