import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class InstanciaService {

  constructor(private firestore: AngularFirestore) {

  }

  //hacemos una metodo para almacenar los datos en la collecion
  async agregarInstancia(instancia: any): Promise<any> {
    await this.firestore.collection('instancias').add(instancia);
  }

  //hacemos una consulta a la base de datos y ordenamos por fecha de creacion
  getInstancias(): Observable<any> {
    return this.firestore.collection('instancias', ref => ref.orderBy('fechaCreacion', 'desc')).snapshotChanges();
  }

  getInstanciasByNombre(nombreMin: string) {
    return this.firestore.collection('instancias', ref => ref.where('nombre', '==', nombreMin)).snapshotChanges();
  }

  fecha(): Observable<any> {
    const startTimestamp = '1696914000';
    const endTimestamp = '1696914000';

    // Realizar la consulta en Firestore
    return this.firestore.collection('instancias', ref => {
      return ref
        .where('nombre', '==', 'Argos')
    }).snapshotChanges();
  }


  //hacemos una metodo recibe el id lo valida y lo elimina
  async eliminarInstancia(id: string): Promise<any> {
    await this.firestore.collection('instancias').doc(id).delete();
  }

  //hacemos un metodo que nos va a retornar todos los datos dependiendo el id
  getInstancia(id: string): Observable<any> {
    return this.firestore.collection('instancias').doc(id).snapshotChanges();
  }
  //hacemos un metodo que va actualizar una instancia por el id
  async actualizarInstancia(id: string, data: any): Promise<any> {
    await this.firestore.collection("instancias").doc(id).update(data);
  }


}
