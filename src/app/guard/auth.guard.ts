import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const workspaceData = localStorage.getItem('workspaceResponse');

    // 🚫 Si pas connecté → redirige vers /login
    if (!workspaceData) {
      return this.router.createUrlTree(['/auth']);
    }

    // ✅ Sinon, autorise l'accès
    return true;
  }
}
