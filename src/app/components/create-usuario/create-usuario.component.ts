import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-usuario',
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.css']
})
export class CreateUsuarioComponent implements OnInit {
  createUsuario: FormGroup;
  id_programa: string | null;
  id_instancia: string | null;
  id: string | null;
  titulo = 'Agregar Usuario';

  ngOnInit(): void {
    this.esEditar()
  }

  constructor(private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
  ) {
    this.createUsuario = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      puntos: ['', Validators.required],
    })
    this.id_programa = this.aRoute.snapshot.paramMap.get('id_programa');
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.id_instancia = this.aRoute.snapshot.paramMap.get('id_instancia');
  }
  agregarEditarUsuarios() {
    if (this.id === null) {
      return this.agregarUsuarios();
    } else {
      return this.editarUsuarios(this.id);
    }
  }
  agregarUsuarios() {
    const usuarios: any = {
      id_programa: this.id_programa,
      usuario: this.createUsuario.value.usuario,
      clave: this.createUsuario.value.clave,
      puntos: this.createUsuario.value.puntos,
      fechaCreacion: (new Date()).getTime(),
      fechaActualizacion: (new Date()).getTime()
    }
    this._usuarioService.agregarUsuarios(usuarios).then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Usuario registrado con exito',
        showConfirmButton: false,
        timer: 1500
      })
      this.router.navigate(['/list-U/', this.id_programa, this.id_instancia])
    }).catch(error => {
      console.log(error)
    })
  }
  editarUsuarios(id: string) {
    const usuarios: any = {
      id_programa: this.id_programa,
      usuario: this.createUsuario.value.usuario,
      clave: this.createUsuario.value.clave,
      puntos: this.createUsuario.value.puntos,
      fechaActualizacion: (new Date()).getTime()
    }
    this._usuarioService.actualizarUsuario(id, usuarios).then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Usuario Actualizada con exito',
        showConfirmButton: false,
        timer: 1500
      })
      this.router.navigate(['/list-U/', this.id_programa, this.id_instancia])
    }).catch(error => {
      console.log(error)
    })
  }
  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Usuario';
      this._usuarioService.getUsuario(this.id).subscribe(data => {
        console.log(data)
        console.log(data.payload.data()['id_programa']);
        this.createUsuario.setValue({
          usuario: data.payload.data()['usuario'],
          clave: data.payload.data()['clave'],
          puntos: data.payload.data()['puntos'],
        })
      })
    }
  }

}
