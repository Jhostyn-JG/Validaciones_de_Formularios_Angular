import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000'; // URL de tu servidor

  constructor(private http: HttpClient) { }
  /*
    saveUser(user: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/guardarUsuario`, user);
    }*/

  saveUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardarUsuario`, userData, { responseType: 'text' }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

}
