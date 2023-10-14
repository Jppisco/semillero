import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GoogleAuthProvider } from '@firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,) { }

  loginGoogle() {
    return this.authLogin(new GoogleAuthProvider())
  }
  authLogin(provider: any) {
    this.afAuth.signInWithPopup(provider).then(result => {
      const user = result.user;
      user.getIdToken().then(idToken => {
        const userData = {
          uid: user.uid,
          correo: user.email,
          token: idToken
        };
        const userDataString = JSON.stringify(userData);

        // Almacena la cadena JSON en sessionStorage
        sessionStorage.setItem('userData', userDataString);
        this.router.navigate(['/list-I']);
      });
    }).catch(error => {
      console.log(error);
    });
  }
  async agregarUsuarios(instancia: any): Promise<any> {
    await this.firestore.collection('usuarios').add(instancia);
  }
  async eliminarUsuario(id: string): Promise<any> {
    await this.firestore.collection('usuarios').doc(id).delete();
  }
  async actualizarUsuario(id: string, data: any): Promise<any> {
    await this.firestore.collection("usuarios").doc(id).update(data);
  }
  getUsuario(id: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(id).snapshotChanges();
  }
  getUsuariosBy(id_programa: string): Observable<any> {
    return this.firestore.collection('usuarios', ref => ref.where('id_programa', '==', id_programa)).snapshotChanges();
  }
}
