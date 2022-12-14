import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable ({providedIn: 'root' })
export class AuthService {
  public token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    return this.token;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post ('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }
  login(email: string, password: string){
    const authData: AuthData ={email: email, password: password};
    this.http.post <{token: string}> ('http://localhost:3000/api/user/login', authData)
      .subscribe(response =>{
      const token = response.token;
      this.token = token;
      this.authStatusListener.next(true);
      this.router.navigate(['/']);
      console.log("here");
      console.log(response);
    });
  }

  logout(){
    this.token = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
