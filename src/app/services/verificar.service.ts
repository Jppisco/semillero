import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class VerificarService {

  constructor(
    private afAuth: AngularFireAuth,
  ) { }
  public verificar() {
    const prom = this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
        return true;
      } else {
        return false;
      }
    });
    return prom
  }
}
