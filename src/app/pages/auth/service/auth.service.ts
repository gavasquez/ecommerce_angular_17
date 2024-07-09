import { HttpClient } from '@angular/common/http';
import { afterNextRender, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
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
    /* afterNextRender(()=>{
      this.initAuth();
    }); */
  }

  initAuth(){
    if(localStorage.getItem("token")){
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ?? '') : null;
      this.token = localStorage.getItem("token")!;
    }
  }

  login(email: string, password: string){

    let URL= URL_SERVICIOS + "/auth/login_ecommerce";

    return this.http.post(URL, { email, password })
      .pipe(
        map((resp: any) => {
          const result = this.saveLocalStorage(resp);
          return result;
        }),
        catchError((error: any) => {
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

  verifiedAuth(data: { code_user: string }){
    let URL = URL_SERVICIOS + "/auth/verified_auth";
    return this.http.post(URL, data);
  }



  verifiedMail(data: { email: string }): Observable<{ message: number }>{
    let URL = URL_SERVICIOS + "/auth/verified_email";
    return this.http.post<{message: number}>(URL, data);
  }

  verifiedCode(data: { code: string }): Observable<{ message:number }>{
    let URL = URL_SERVICIOS + "/auth/verified_code";
    return this.http.post<{ message:number }>(URL, data);
  }

  verifiedNewPassword(data: { code: string, new_password: string }): Observable<{ message: number }>{
    let URL = URL_SERVICIOS + "/auth/new_password";
    return this.http.post<{ message: number }>(URL, data);

  }

}
