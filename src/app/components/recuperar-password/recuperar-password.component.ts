import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
})
export class RecuperarPasswordComponent implements OnInit {
  recuperarUsuario: FormGroup;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firebaseError: FirebaseCodeErrorService
  ) {
    this.recuperarUsuario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void { }
  recuperar() {
    const email = this.recuperarUsuario.value.correo;
    this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'le enviamos un mensaje a su correo para reestablecer la contraseña',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/login']);
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
}
