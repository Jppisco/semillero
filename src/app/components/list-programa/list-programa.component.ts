import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramaService } from 'src/app/services/programa.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-programa',
  templateUrl: './list-programa.component.html',
  styleUrls: ['./list-programa.component.css']
})
export class ListProgramaComponent implements OnInit {

  correo = sessionStorage.getItem('correo');
  titulo = 'Lista de programas';
  id_instancia: string | null;
  programaABuscar: string | undefined;
  programa: any[] = [];
  itemsPerPage: number = 5;
  currentPage: number = 1;
  currentPageItems: any[] = [];

  ngOnInit(): void {
    this.getpro();
  }

  onPageChange() {
    this.loadCurrentPageItems();
  }

  constructor(
    private _programaService: ProgramaService,
    private aRoute: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.id_instancia = this.aRoute.snapshot.paramMap.get('id_instancia');
  }

  loadCurrentPageItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.programa.slice(startIndex, endIndex);
  }
  totalPages() {
    return Math.ceil(this.programa.length / this.itemsPerPage);
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
  getpro() {
    if (this.id_instancia !== null) {
      return this.getProgramaId(this.id_instancia)
    }
  }
  limpiarInput() {
    this.programaABuscar = '';
    this.getpro();
    return;
  }
  getProgramaByNombre() {
    if (!this.programaABuscar) {
      this.getpro();
      return;
    }
    this._programaService.getProgramas().subscribe(data => {
      const programas = data.map((element: any) => {
        const nombre = element.payload.doc.data().nombre.toLowerCase();
        const fechaCreacion = new Date(element.payload.doc.data().fechaCreacion.toDate()).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const fechaActualizacion = new Date(element.payload.doc.data().fechaActualizacion.toDate()).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        return {
          id: element.payload.doc.id,
          nombre: nombre,
          id_programa: element.payload.doc.data().id_programa,
          fechaCreacion: fechaCreacion,
          fechaActualizacion: fechaActualizacion,
          doc_id: element.payload.doc.data().doc_id,
          id_instancia: element.payload.doc.data().id_instancia,
          pais: element.payload.doc.data().pais,
        };
      });
      const filteredProgramas = programas.filter((programa: { nombre: string | undefined; }) =>
        programa.nombre === this.programaABuscar
      );
      this.currentPageItems = filteredProgramas;
    });
  }
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('tabla-exportar')
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    XLSX.writeFile(wb, 'lista programa.xlsx');
  }
  getProgramaId(id_instancia: string) {
    this._programaService.getProgramasBy(id_instancia).subscribe(data => {
      this.programa = data.map((element: any) => {
        return {
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        };
      });
      this.loadCurrentPageItems();
    })
  }
  eliminarPrograma(id: string) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: "Esta Accion es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._programaService.eliminarPrograma(id).then(() => {
          console.log(id);
          console.log('programa eliminada correctamente')
        }).catch(error => {
          console.log(error)
        })
        Swal.fire(
          'Eliminado!',
          'El programa ha sido borrada correctamente.',
          'success'
        )
      }
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
