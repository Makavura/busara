import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfile: any;
  isLoading: Boolean;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.spinner.show();
    this.http.get(`http://fullstack-role.busara.io/api/v1/users/current-user`, { observe: 'response' }).subscribe((response) => {

      this.userProfile = response.body;
      this.isLoading = false;
      this.spinner.hide();

    });

  }

}
