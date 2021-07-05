import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }

  login(email: string, password: string) {

    const body = new HttpParams()
      .set(`client_id`, '')
      .set(`client_secret`, '')
      .set(`grant_type`, 'password')
      .set(`username`, email) // 
      .set(`password`, password); // 
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post(`http://fullstack-role.busara.io/api/v1/oauth/token/`, body.toString(), { headers, observe: 'response' }).pipe(
      map(response => {
        let _: any = response.body;
        console.warn(_)
        this.setSession(_);
      } ))
      
  }

  private setSession(authResult: AuthResponse) {
    const expiresAt = moment().add(authResult.expires_in, 'second');

    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

}

interface AuthResponse {
  "access_token": string,
  "expires_in": number,
  "token_type": string,
  "scope": "read" | "write" | "groups",
  "refresh_token": string,
  "permissions": Array<[]>
}