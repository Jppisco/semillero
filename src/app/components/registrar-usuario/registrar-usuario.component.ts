import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

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

    private user: UserService,

  ) {

    this.registrarUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: ['', Validators.required],
    });

  }

  ngOnInit(): void { }
  registrar() {
    let data = {
      email: this.registrarUsuario.value.email,
      password: this.registrarUsuario.value.password,
    };

    this.user.SignUp(
      this.registrarUsuario.value.email,
      this.registrarUsuario.value.password,
      data
    );
  }

}
