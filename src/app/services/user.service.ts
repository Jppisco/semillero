import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FirebaseCodeErrorService } from './firebase-code-error.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private router: Router,
    private firebaseError: FirebaseCodeErrorService,) { }

  // Registrar con usuario y contraseña
  SignUp(email: string, password: string, userInfo: any) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SendVerificationMail();
        this.SetUserData(result.user, userInfo);
        this.router.navigate(['login']);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Registro exitoso',
          showConfirmButton: false,
          timer: 3000
        })
        console.log('¡Registro exitoso!', 'Éxito');
      })
      .catch((error) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: this.firebaseError.codeError(error.code),
          showConfirmButton: false,
          timer: 1500
        })
      });
  }


  SendVerificationMail() {
    this.afAuth.currentUser
      .then((user: any) => user?.sendEmailVerification())
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'Le enviamos un correo electronico para su verificacion',
          showConfirmButton: false,
          timer: 5000
        })
        this.router.navigate(['/login']);
      });

  }





  //Guarda la informacion en database
  SetUserData(user: any, userInfo?: any) {
    const userRef: any = this.afs.doc(`users/${user.uid}`);
    const userData: any = {
      uid: user.uid,
      email: user.email,
      password: userInfo.password,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  //Para iniciar session
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then((user) => {
      //validamos si el correo ya fue verificado
      if (user.user?.emailVerified) {
        this.afAuth.authState.subscribe((user: any) => {
          localStorage.setItem('uid', user.uid);
          localStorage.setItem('email', user.email);
          this.router.navigate(['/list-I']);
        })
      }
      else {
        this.router.navigate(['/verificar-correo']);
      }

    }).catch((error) => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: this.firebaseError.codeError(error.code),
        showConfirmButton: false,
        timer: 1500
      })
    })

  }


}
