import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../services/crud.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: {
    email: string;
    password: string;
  } = {
    email: '',
    password: '',
  };

  loading: Boolean;

  errors: {
    badCredentials: Boolean,
    email: Boolean,
    password: Boolean,
    other: Boolean,
  } = {
    badCredentials: false,
    email: false,
    password: false,
    other: false,
  };

  constructor(private userService: CrudService) {}

  ngOnInit(): void {}

  resetErrors() {
    this.errors = {
      badCredentials: false,
      email: false,
      password: false,
      other: false,
    };
  }

  logIn() {
    if (this.loading === true) return;

    this.resetErrors();

    if (!this.login.email) {
      this.errors.email = true
      return
    }

    if (!this.login.password) {
      this.errors.password = true
      return
    }

    this.loading = true;
    this.userService.checkCredentials(this.login).subscribe((response:any) => {
      const {user, token} = response.data
      this.loading = false;
      this.userService.finalCheckIn(user, token);
    }, (error) => {
      this.loading = false;
      if (error.status === 400) {
        this.errors.badCredentials = true;
      }
    });
  }
}
