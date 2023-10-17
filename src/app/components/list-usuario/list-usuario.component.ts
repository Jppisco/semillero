import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.css']
})
export class ListUsuarioComponent implements OnInit {
  correo = sessionStorage.getItem('correo');
  titulo = 'Lista de Usuarios';
  id_programa: string | null;
  id_instancia: string | null;
  usuario: any[] = [];
  itemsPerPage: number = 5;
  currentPage: number = 1;
  currentPageItems: any[] = [];

  ngOnInit(): void {
    this.getusu();
  }
  onPageChange() {
    this.loadCurrentPageItems();
  }

  constructor(
    private _usuarioService: UsuarioService,
    private aRoute: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.id_programa = this.aRoute.snapshot.paramMap.get('id_programa');
    this.id_instancia = this.aRoute.snapshot.paramMap.get('id_instancia');

  }
  loadCurrentPageItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.usuario.slice(startIndex, endIndex);
  }
  totalPages() {
    return Math.ceil(this.usuario.length / this.itemsPerPage);
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
  getusu() {
    if (this.id_programa !== null) {
      return this.getUsuarioId(this.id_programa)
    }
  }
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('tabla-exportar')
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    XLSX.writeFile(wb, 'lista usuarios.xlsx');
  }
  getUsuarioId(id_programa: string) {
    this._usuarioService.getUsuariosBy(id_programa).subscribe(data => {
      this.usuario = data.map((element: any) => {
        return {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        };
      });
      console.log(this.usuario)
      this.loadCurrentPageItems();
    })
  }
  eliminarUsuario(id: string) {
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
        this._usuarioService.eliminarUsuario(id).then(() => {
          console.log(id);
          console.log('usuario eliminada correctamente')
        }).catch(error => {
          console.log(error)
        })
        Swal.fire(
          'Eliminado!',
          'El Usuario ha sido borrada correctamente.',
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
