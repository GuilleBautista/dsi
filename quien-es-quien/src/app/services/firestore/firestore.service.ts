import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {IGameData, GameData} from '../../clases/gamedata';
import { Observable } from 'rxjs';
import { Iset,Set } from '../../clases/sets';
import { AngularFireStorage } from '@angular/fire/storage';
import { ObserversModule } from '@angular/cdk/observers';
import * as firebase from 'firebase';
import { SesionData } from 'src/app/clases/sesiondata';


import { User } from '../../user';




@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  //FirestoreCollection
  private afsU:AngularFirestoreCollection<User>;


  private game_cookies:AngularFirestoreCollection<any>;
  private sesion_cookies:AngularFirestoreCollection<any>;
  
  constructor(private firestore: AngularFirestore, public storage:AngularFireStorage) {

    this.game_cookies=this.firestore.collection('game_cookies');
    this.sesion_cookies=this.firestore.collection('sesion_cookies');

  

    //Colección usuarios
    this.afsU=this.firestore.collection('usuarios');
  
  }



  //-------------------------Funciones usuarios-------------------------

  public createUser(data: User):Promise<string>
  {
    data.id=this.firestore.createId();
    return this.afsU.doc(data.id).set({data}).then(r=>{
      return data.id;
    });
  }


  public getUser(id: string):Promise<User>
  {
    return this.afsU.doc(id).get().toPromise().then(r=>{
      return r.data() as User;
    });

  }


  public getUsers():Observable<User[]>
  {
    return this.afsU.valueChanges();
  }


  public updateUser(data:User){
    return this.afsU.doc(data.id).set(Object.assign({}, data));
  }

  public getOrderedUsers():Observable<User[]>{

    return this.firestore.collection<User>('usuarios',ref=>ref.orderBy('points', 'desc')).valueChanges();
  }


//-------------------------Game cookies-------------------------

  public getGameCookie(id:string):Promise<any>{
    return this.game_cookies.doc(id).get().toPromise();
  
  }

  public updateGameCookie(data:GameData){
    return this.game_cookies.doc(data.id).set(Object.assign({}, data));
  }


//-------------------------Sesion Cookies-------------------------

  //Para comprobar si una cookie de sesion existe
  public getSesionCookie(sesionck:string):Promise<any>{
    return this.sesion_cookies.doc(sesionck).get().toPromise();
  }

  //Recibe datos de sesion con id generado previamente
  public createSesion(sesion_data:SesionData){
    console.log("sesion cookies doc", this.sesion_cookies.doc(sesion_data.id))

    //Creamos la sesion con los datos recibidos
    this.sesion_cookies.doc(sesion_data.id).set(Object.assign({}, sesion_data));
    
  }


//-------------------------Storage Functions-------------------------

  public getStorage(){
    return this.storage;
  }

  public getImg(img:string):Observable<string>{
    let ref = this.storage.ref(img);

    return ref.getDownloadURL();

  }

  public getFiles(path:string){

    let ref=this.storage.ref(path);

    return ref.listAll();
  }


}
