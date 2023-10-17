import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  constructor(private firestore: AngularFirestore) { }

  async agregarProgramas(programa: any): Promise<any> {
    await this.firestore.collection('programas').add(programa);
  }
  getProgramas(): Observable<any> {
    return this.firestore.collection('programas', ref => ref.orderBy('fechaCreacion', 'desc')).snapshotChanges();
  }
  getProgramasBy(id_instancia: string): Observable<any> {
    return this.firestore.collection('programas', ref => {
      return ref
        .where('id_instancia', '==', id_instancia)
        .orderBy('fechaCreacion', 'desc');
    }).snapshotChanges();
  }
  fecha(inicio: number, fin: number): Observable<any> {
    return this.firestore.collection('programas', ref => {
      return ref
        .where('fechaCreacion', '>', inicio)
        .where('fechaCreacion', '<', fin)
    }).snapshotChanges();
  }
  async eliminarPrograma(id: string): Promise<any> {
    await this.firestore.collection('programas').doc(id).delete();
  }
  async actualizarPrograma(id: string, data: any): Promise<any> {
    await this.firestore.collection("programas").doc(id).update(data);
  }
  getPrograma(id: string): Observable<any> {
    return this.firestore.collection('programas').doc(id).snapshotChanges();
  }

}
