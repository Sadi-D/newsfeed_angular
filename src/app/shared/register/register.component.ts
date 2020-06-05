import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CrudService } from "../../services/crud.service";
const hasNumberRegex = /\S*\d+\S*/g;
const hasUpperCaseRegex = /\S*[A-Z]+\S*/g;
const hasLowerCaseRegex = /\S*[a-z]+\S*/g;

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  } = {
    firstName: "",
    lastName: "",
    email: "",
  };
  password: {
    reference: string;
    confirmation: string;
  } = {
    reference: null,
    confirmation: null,
  }

  loading: Boolean = false;

  errors: {
    password: {
      reference: Boolean;
      confirmation: Boolean;
    };
    other: Boolean;
  } = {
    password: {
      reference: false,
      confirmation: false,
    },
    other: false,
  };

  constructor(
    private route: ActivatedRoute,
    private userService: CrudService,
    private router: Router
  ) {}

  ngOnInit() {}

  resetErrors() {
    this.errors = {
      password: {
        reference: false,
        confirmation: false,
      },
      other: false,
    };
  }

  checkPassword() {
    let noError = true;

    if (!this.password.reference) {
      this.errors.password.reference = true;
      return false;
    }

    if (this.password.reference !== this.password.confirmation) {
      this.errors.password.confirmation = true;
      noError = false;
    }

    if (
      hasNumberRegex.test(this.password.reference) === false ||
      hasUpperCaseRegex.test(this.password.reference) === false ||
      hasLowerCaseRegex.test(this.password.reference) === false ||
      this.password.reference.length < 8
    ) {
      this.errors.password.reference = true;
      noError = false;
    }

    return noError;
  }

  register() {
    this.resetErrors();
    if (!this.checkPassword()) return;

    this.loading = true;
    this.userService.register(this.user, this.password.reference).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(["/login"]);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
