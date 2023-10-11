import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginUsuario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseError: FirebaseCodeErrorService,
    private userService: UsuarioService,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void { }
  loginGoogle() {
    this.userService.loginGoogle()
  }
  //metodo para validar el login con los datos del formulario

  login() {
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;
    this.afAuth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      if (userCredential.user?.emailVerified) {
        this.afAuth.authState.subscribe((dato: any) => {
          sessionStorage.setItem('uid', dato.uid);
          sessionStorage.setItem('correo', dato.email);
          this.router.navigate(['/list-I']);
        })
      } else {
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
