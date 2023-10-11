import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const uid = sessionStorage.getItem('uid');
      const correo = sessionStorage.getItem('correo');
      console.log(uid, correo)
      if (uid && correo) {
        resolve(true);
      } else {
        this.router.navigate(['/login']);
        sessionStorage.clear();
        resolve(false);
      }
    });
  }
}
