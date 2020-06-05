import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGardService implements CanActivate {

  constructor(protected router: Router, protected userService: CrudService) { }

  canActivate(): boolean {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
