import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CrudService } from "../../services/crud.service";

@Component({
  selector: "header-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit {
  public mobileNav: { isOpen: boolean };
  public currentUser: any;

  constructor(private userService: CrudService, private router: Router) {
    this.mobileNav = {
      isOpen: false,
    };
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }

  toggleMobileMenu() {
    this.mobileNav.isOpen = !this.mobileNav.isOpen;
  }

  logout() {
    this.userService.logout();
    this.toggleMobileMenu();
  }
}
