import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InstanciaService } from 'src/app/services/instancia.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-instancia',
  templateUrl: './create-instancia.component.html',
  styleUrls: ['./create-instancia.component.css']
})
export class CreateInstanciaComponent implements OnInit {
  //generamos variables
  createInstancia: FormGroup;
  id: string | null;
  titulo = 'Agregar Instancia';

  ngOnInit(): void {
    //iniciamos este metodo apenas se abra el omponente
    this.esEditar();
  }

  constructor(
    private _instanciaService: InstanciaService,
    private _usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
  ) {
    //recolectamos todos los datos del formulario
    this.createInstancia = this.fb.group({
      nombre: ['', Validators.required],
      doc_id: ['', Validators.required],
      pais: ['', Validators.required],
    })
    //tomamos el id que viene por la ruta
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  //funcion para saber si el id esta null o lleva parametro, depende de eso ejecuta el actualizar o el añadir
  agregarEditarIntancias() {
    if (this.id === null) {
      return this.agregarIntancias();
    } else {
      return this.editarInstancia(this.id);
    }
  }
  //funcion para agregar instancias
  agregarIntancias() {
    //definimos un objeto con todos los atributos del formulario
    const instancia: any = {
      id_instancia: this.createInstancia.value.nombre.toLowerCase().replace(/ /g, '_'),
      nombre: this.createInstancia.value.nombre,
      doc_id: this.createInstancia.value.doc_id,
      pais: this.createInstancia.value.pais,
      fechaCreacion: (new Date()).getTime(),
      fechaActualizacion: (new Date()).getTime()
    }
    //hacemos llamado a la funcion que hay en el servicio y almacenamos un firebase
    this._instanciaService.agregarInstancia(instancia).then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Instancia registrado con exito',
        showConfirmButton: false,
        timer: 1500
      })
      console.log('Instancia registrado con exito');
      this.router.navigate(['/list-I'])
    }).catch(error => {
      console.log(error)
    })
  }
  //funcion para editar instancias
  editarInstancia(id: string) {
    const instancia: any = {
      nombre: this.createInstancia.value.nombre,
      doc_id: this.createInstancia.value.doc_id,
      pais: this.createInstancia.value.pais,
      fechaActualizacion: (new Date()).getTime()
    }

    this._instanciaService.actualizarInstancia(id, instancia).then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Instancia Actualizada con exito',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("Instancia Actualizada");
      this.router.navigate(['/list-I'])
      console.log(instancia)
    }).catch(error => {
      console.log(error)
    })
  }
  //rellenamos el HTML con el set value y con lo que retorna el metodo de la instancia
  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar instancia';
      this._instanciaService.getInstancia(this.id).subscribe(data => {
        console.log(data)
        console.log(data.payload.data()['nombre']);
        this.createInstancia.setValue({
          nombre: data.payload.data()['nombre'],
          doc_id: data.payload.data()['doc_id'],
          pais: data.payload.data()['pais'],
        })
      })
    }
  }
}
