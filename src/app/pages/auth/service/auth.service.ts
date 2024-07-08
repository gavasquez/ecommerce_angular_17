import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string = '';
  user: any;

  constructor(
    private http: HttpClient,
    private router: Router,
  ){
    this.initAuth();
  }

  initAuth(){
    if(localStorage.getItem("token")){
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ?? '') : null;
      this.token = localStorage.getItem("token")!;
    }
  }

  login(email: string, password: string){

    let URL= URL_SERVICIOS + "/auth/login_ecommerce";

    return this.http.post(URL, {email, password, "type_user": "2"})
      .pipe(
        map((resp: any) => {
          console.log(resp)
          const result = this.saveLocalStorage(resp);
          return result;
        }),
        catchError((error: any) => {
          console.log(error);
          return of(error);
        })
      );

  }

  saveLocalStorage(resp: any): boolean {
    if(resp && resp.access_token) {
      localStorage.setItem("token", resp.access_token);
      localStorage.setItem("user", JSON.stringify(resp.user));
      return true;
    }
    return false;
  }

  register(data: any) {
    let URL = URL_SERVICIOS + "/auth/register";
    return this.http.post(URL, data);
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.user = null;
    this.token = "";
    setTimeout(() => {
      this.router.navigateByUrl("/login");
    }, 500);
  }

}
