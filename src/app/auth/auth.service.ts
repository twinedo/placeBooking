import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  // tslint:disable-next-line: variable-name
  private _userIsAuthenticated = true;
  // tslint:disable-next-line: variable-name
  private _userId = 'abc';

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor(
    private http: HttpClient
  ) { }

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }

  
}
