import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HttpJwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthenticationService) { }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const currentUserToken = localStorage.getItem("access_token");
        if(this.authService.isLoggedIn && currentUserToken) {
            httpRequest = httpRequest.clone({ setHeaders: {
                Authorization: `Token `
            } });

        } else if(!this.authService.isLoggedIn) {

        }

        return next.handle(httpRequest).pipe(catchError(error => {
            if(error instanceof HttpResponse && (error.status === 401 || error.status === 403)){
                this.authService.logout();
                return throwError(error);
            }
        }))

    }
}