import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {IGameData, GameData} from '../../clases/gamedata';
import { Observable } from 'rxjs';
import { Iset,Set } from '../../clases/sets';
import { AngularFireStorage } from '@angular/fire/storage';
import { ObserversModule } from '@angular/cdk/observers';
import * as firebase from 'firebase';
import { SesionData } from 'src/app/clases/sesiondata';



@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  private game_cookies:AngularFirestoreCollection<any>;
  private sesion_cookies:AngularFirestoreCollection<any>;
  
  constructor(private firestore: AngularFirestore, public storage:AngularFireStorage) {

    this.game_cookies=this.firestore.collection('game_cookies');
    this.sesion_cookies=this.firestore.collection('sesion_cookies');

  }

  public getGameCookie(id:string):Promise<any>{
    return this.game_cookies.doc(id).get().toPromise();
  
  }

  public updateGameCookie(data:GameData){
    return this.game_cookies.doc(data.id).set(Object.assign({}, data));
  }


  //Para comprobar si una cookie de sesion existe
  public getSesionCookie(sesionck:string):Promise<any>{
    return this.sesion_cookies.doc(sesionck).get().toPromise();
  }

  //Recibe datos de sesion con id generado previamente
  public createSesion(sesion_data:SesionData){
    //Creamos la sesion con los datos recibidos
    return this.sesion_cookies.doc(sesion_data.id).set(Object.assign({}, sesion_data)).then(r=>{
      //Devuelve el id de la sesion
      console.log(r);
      return sesion_data.id;
    })
  }


//------------------------Storage Functions------------------------------

  public getImg(img:string):Observable<string>{
    let ref = this.storage.ref(img);
    
    return ref.getDownloadURL();
    
  }

  public getFiles(path:string){

    let ref=this.storage.ref(path);

    return ref.listAll();
  }
  

}  

