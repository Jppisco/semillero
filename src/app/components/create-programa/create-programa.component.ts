import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramaService } from 'src/app/services/programa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-programa',
  templateUrl: './create-programa.component.html',
  styleUrls: ['./create-programa.component.css']
})
export class CreateProgramaComponent implements OnInit {
  //generamos variables
  createPrograma: FormGroup;
  id_instancia: string | null;
  id: string | null;
  titulo = 'Agregar programa';

  ngOnInit(): void {
    this.esEditar()
  }

  constructor(
    private _programaService: ProgramaService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
  ) {
    this.createPrograma = this.fb.group({
      nombre: ['', Validators.required],
      pais: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.id_instancia = this.aRoute.snapshot.paramMap.get('id_instancia');
  }

  agregarEditarProgramas() {
    if (this.id === null) {
      return this.agregarProgramas();
    } else {
      return this.editarProgramas(this.id);
    }
  }
  agregarProgramas() {
    const programa: any = {
      id_instancia: this.id_instancia,
      id_programa: this.createPrograma.value.nombre.toLowerCase().replace(/ /g, '_'),
      nombre: this.createPrograma.value.nombre,
      pais: this.createPrograma.value.pais,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this._programaService.agregarProgramas(programa).then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Programa registrado con exito',
        showConfirmButton: false,
        timer: 1500
      })
      this.router.navigate(['/list-P/', this.id_instancia])
    }).catch(error => {
      console.log(error)
    })
  }
  editarProgramas(id: string) {
    const programas: any = {
      id_instancia: this.id_instancia,
      id_programa: this.createPrograma.value.nombre.toLowerCase().replace(/ /g, '_'),
      nombre: this.createPrograma.value.nombre,
      pais: this.createPrograma.value.pais,
      fechaActualizacion: new Date()
    }
    this._programaService.actualizarPrograma(id, programas).then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Programa Actualizada con exito',
        showConfirmButton: false,
        timer: 1500
      })
      this.router.navigate(['/list-P/', this.id_instancia])
      console.log('/list-P/', this.id_instancia)
    }).catch(error => {
      console.log(error)
    })
  }
  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Programa';
      this._programaService.getPrograma(this.id).subscribe(data => {
        console.log(data)
        console.log(data.payload.data()['id_instancia']);
        this.createPrograma.setValue({
          nombre: data.payload.data()['nombre'],
          pais: data.payload.data()['pais'],
        })
      })
    }
  }

}