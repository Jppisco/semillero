import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
})
export class RegistrarUsuarioComponent implements OnInit {
  registrarUsuario: FormGroup;


  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firebaseError: FirebaseCodeErrorService,
  ) {
    this.registrarUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  registrar() {
    const email = this.registrarUsuario.value.email;
    const password = this.registrarUsuario.value.password;
    const repetirPassowrd = this.registrarUsuario.value.repetirPassword;

    console.log(this.registrarUsuario);
    //valida que las dos contraseñas sean iguales
    if (password !== repetirPassowrd) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Las contraseñas ingresadas deben ser las mismas',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    //si las contraseñas son iguales va a registar el usuario
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        //llamamos el metodo para ver si el correo ya fue validado
        this.verificarCorreo();
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
  //metodo para verificar el corre
  verificarCorreo() {
    this.afAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'Le enviamos un correo electronico para su verificacion',
          showConfirmButton: false,
          timer: 3000
        })
        this.router.navigate(['/login']);
      });
  }

}
