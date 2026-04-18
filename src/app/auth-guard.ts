import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      return true;
    }

    this.toastr.info('Please use Demo Login first to access this page.', 'Protected Route');
    return this.router.createUrlTree(['/demo-public']);
  }
}
