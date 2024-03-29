import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRegistration } from '../Models/ UserRegistration';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  private apiUrl = 'https://localhost:7087/api/Registration/register';
  private loginApiUrl = 'https://localhost:7087/api/Registration/login';
  private contactUsApiUrl = 'https://localhost:7087/api/ContactUs';
  private currentUserSubject: BehaviorSubject<UserRegistration | null> = new BehaviorSubject<UserRegistration | null>(null);
  public currentUser: Observable<UserRegistration | null> = this.currentUserSubject.asObservable();
  constructor(private httpClient: HttpClient) { 
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
 
  AddUser(user : UserRegistration): Observable<UserRegistration>{
    console.log("user", user.userId)
    return this.httpClient.post<UserRegistration>(this.apiUrl, user);
  }

  login(userCredentials: any): Observable<any> {
    return this.httpClient.post<any>(this.loginApiUrl, userCredentials);
  }

  setCurrentUser(user: UserRegistration) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  decodeJWT(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

addCustomer(data: any) {
  return this.httpClient.post(this.contactUsApiUrl, data);
}

}
