import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { UtilsService } from './utils.service';
import { User } from '../models/user.model';
import { Horarios } from '../models/horario.model';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  public horarios : Horarios[] = [];
  constructor() { }

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);

  user(): User {
    return this.utilsService.getFromLocalStorge('user');
  }

  async getHorarios(): Promise<Horarios[]> {
    let path = `users/${this.user().uid}/horarios`;

    const loading = await this.utilsService.loading();

    await loading.present();
    const querySnapshot = this.firebaseService.getDoc(path);

    (await querySnapshot).forEach((doc) => {
      const elemnt: Horarios =
      {
        uid: doc.id,
        title: doc.data()['name'],
        active: doc.data()['active'],
        mode: doc.data()['mode'],
        color: doc.data()['color'],
        url: `/horarios/${doc.data()['name']}`
      }
      
      this.horarios.push(elemnt)
    });
    
    this.utilsService.saveInLocalStorge('horarios', this.horarios)

    loading.dismiss()

    return this.horarios
  }

  getColor(searchtitle:string){
    const arrayH = this.utilsService.getFromLocalStorge('horarios')
    return arrayH.find(({ title }) => title === searchtitle).color
  }

}
