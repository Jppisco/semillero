import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstanciaService } from 'src/app/services/instancia.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-list-instancia',
  templateUrl: './list-instancia.component.html',
  styleUrls: ['./list-instancia.component.css']
})
export class ListInstanciaComponent implements OnInit {

  correo = sessionStorage.getItem('correo');
  titulo = 'Lista de instancias';
  allInstancias: any[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  currentPageItems: any[] = [];
  nombreABuscar: string | undefined;
  fechaInicio: Date | undefined;
  fechaFin: string | undefined;

  ngOnInit(): void {
    this.getInstancias();
  }
  onPageChange() {
    this.loadCurrentPageItems();
  }

  constructor(
    private _instanciaService: InstanciaService,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) { }

  limpiarInput() {
    this.nombreABuscar = '';
    this.getInstancias();
    return;
  }
  getInstanciaByNombre() {
    if (!this.nombreABuscar) {
      this.getInstancias();
      return;
    }
    this._instanciaService.getInstancias().subscribe(data => {
      const instancias = data.map((element: any) => {
        const nombre = element.payload.doc.data().nombre.toLowerCase();

        return {
          id: element.payload.doc.id,
          nombre: nombre,
          fechaCreacion: element.payload.doc.data().fechaCreacion,
          fechaActualizacion: element.payload.doc.data().fechaActualizacion,
          doc_id: element.payload.doc.data().doc_id,
          id_instancia: element.payload.doc.data().id_instancia,
          pais: element.payload.doc.data().pais,
        };
      });
      const filteredInstancias = instancias.filter((instancia: { nombre: string | undefined; }) =>
        instancia.nombre === this.nombreABuscar
      );
      this.currentPageItems = filteredInstancias;
    });
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('tabla-exportar')
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    XLSX.writeFile(wb, 'lista instancias.xlsx');
  }
  loadCurrentPageItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.allInstancias.slice(startIndex, endIndex);
  }
  totalPages() {
    return Math.ceil(this.allInstancias.length / this.itemsPerPage);
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onPageChange();
    }
  }
  nextPage() {
    const totalPages = this.totalPages();
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.onPageChange();
    }
  }
  async getInstancias() {
    await this._instanciaService.getInstancias().subscribe(data => {
      this.allInstancias = data.map((element: any) => {
        return {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),

        };
      });
      this.loadCurrentPageItems();
    });
  }
  async fechas() {
    const inicio = (new Date(this.fechaInicio)).getTime();
    const timestampInicio = Math.floor(inicio.valueOf() / 1000);
    const fin = (new Date(this.fechaFin)).getTime();
    const timestampFin = Math.floor(fin.valueOf() / 1000);

    console.log(timestampInicio, timestampFin);
    await this._instanciaService.fecha(inicio, fin).subscribe(data => {
      this.allInstancias = data.map((element: any) => {

        return {
          id: element.payload.doc.id,

          ...element.payload.doc.data(),
        };
      });
      console.log(this.allInstancias)
      this.loadCurrentPageItems();
    });
  }

  eliminarInstancia(id: string) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: "Esta Accion es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (!result.isConfirmed) return
      this._instanciaService.eliminarInstancia(id).then(() => {
        console.log(id);
        console.log('instancia eliminada correctamente')
      }).catch(error => {
        console.log(error)
      })
      Swal.fire(
        'Eliminado!',
        'La instancia ha sido borrada correctamente.',
        'success'
      )
    })
  }
  logOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login'])
      localStorage.clear();
      sessionStorage.clear();
    });
  }

}
