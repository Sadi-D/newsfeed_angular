import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

// interface UserData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   bookmarks: Object[];
// }

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  // private user: UserData;
  apiUrl: string;
  httpOptionsJson: Object;
  currentUser: BehaviorSubject<any>;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) {
    this.apiUrl = environment.API_URL;
    this.httpOptionsJson = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.currentUser = new BehaviorSubject<any>(null);
  }

  getUser(jwt) {
    const body = { token: jwt }
    const observableUser = this.http.post(`${this.apiUrl}/me`, body);
    observableUser.subscribe( (response: any) => {
      const { user, bookmark } = response.data

      user.bookmarks = bookmark
      this.currentUser.next(user);
    });
    return observableUser;
  }

  register(user, password) {
    const body = {firstname: user.firstName, lastname: user.lastName, password, email: user.email};

    return this.http.post(`${this.apiUrl}/register`, body, this.httpOptionsJson);
  }

  checkCredentials(loginData) {
    const { email, password } = loginData;
    return this.http.post(`${this.apiUrl}/login`, {email, password}, this.httpOptionsJson );
  }

  addToBookmarks(source) {
    const response = this.http.post(`${this.apiUrl}/bookmark`, {...source, token: localStorage.getItem('access_token')}, this.httpOptionsJson );
    response.subscribe((res:any) => {
      const user = this.currentUser.getValue()
      user.bookmarks = [...user.bookmarks, res.data.data]
      this.currentUser.next(user)
    })
    return response
  }
  removeFromBookmarks(bookmark) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        token: localStorage.getItem('token'),
      },
    };
    const response = this.http.delete(`${this.apiUrl}/bookmark/${bookmark._id}`, options);
    response.subscribe((res) => {
      const user = this.currentUser.getValue()
      user.bookmarks = user.bookmarks.filter(bookmarkItem => bookmarkItem._id !== bookmark._id)
      this.currentUser.next(user)
    })
    return response
  }

  finalCheckIn(user, token) {
    this.getUser(token).subscribe((response:any) => {
      localStorage.setItem('access_token', token);
      const { user, bookmark } = response.data
      user.bookmarks = bookmark
      this.currentUser.next(user);
      this.router.navigate(['/']);
    })
  }

  logout() {
    const response = this.http.get(`${this.apiUrl}/logout`)
    response.subscribe(() => {
      localStorage.removeItem('access_token');
      this.currentUser.next(null);
    })
    return response
  }

  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser.asObservable();
  }

}
