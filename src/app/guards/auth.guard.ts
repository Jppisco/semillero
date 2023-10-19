import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const userDataString = sessionStorage.getItem('userData');

      if (userDataString) {
        const userData = JSON.parse(userDataString);

        if (userData && userData.uid && userData.correo && userData.token) {
          // Todos los datos necesarios están presentes en el objeto
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          sessionStorage.clear();
          resolve(false);
        }
      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }
}
