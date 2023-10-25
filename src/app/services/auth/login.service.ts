import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest } from 'src/app/services/auth/loginRequest';
import { User } from './user';

const AUTH_API = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  currentUserLoginOn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({ username: '', password: '' });//Lo ideal es tomar la información del session storage

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<User> {
    // return this.http.get<User>('././assets/data.json').pipe(
    const bodyData = credentials; //JSON.stringify('{"username": "pmarchionno@gmail.com", "password":"1234"}');
    let httpHeaders= new HttpHeaders();
    httpHeaders.append('Content-Type', 'application/json');
    return this.http.post<User>(AUTH_API + 'login', bodyData)
      .pipe(
        tap((userData: any) => { //operador que no tiene efectos secundarias pero nos permite realizar acciones extras
          console.log(userData)
          this.currentUserData.next(userData);
          this.currentUserLoginOn.next(true);
        }),
        catchError(this.handleError)
      )
      ;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status == 0) {
      console.log("Se produjo un error: " + error.error)
    } else {
      console.error("Se retornó el código de estado: ", error.status, error.error)
    }
    return throwError(() => new Error('Usuario inexistente o contraseña inválida'))
  }

  get userData(): Observable<User> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<Boolean> {
    return this.currentUserLoginOn.asObservable();
  }
}
