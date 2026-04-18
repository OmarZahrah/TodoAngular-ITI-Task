import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: false,
})
export class AppHeaderComponent {
  private readonly authService = inject(AuthService);
  readonly isLoggedIn$ = this.authService.isLoggedIn$;

  loginDemoUser(): void {
    this.authService.loginDemoUser();
  }

  logoutDemoUser(): void {
    this.authService.logoutDemoUser();
  }
}
