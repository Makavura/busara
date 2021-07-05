import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  login() {
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password).subscribe((response) => {
        this.form.reset();
        /* Reroute to profile */
        this.toastr.success('Login Successful!');

        const timer = setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1000);

      }, (error) => {
        if(error) {
          if(error.status == 400) {
            /* 
            Bad request
            Display error modal
            */


          } 
        }
      })
    }
  }

}
