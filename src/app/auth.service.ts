import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);
  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  loginDemoUser(): void {
    this.isLoggedInSubject.next(true);
  }

  logoutDemoUser(): void {
    this.isLoggedInSubject.next(false);
  }
}
