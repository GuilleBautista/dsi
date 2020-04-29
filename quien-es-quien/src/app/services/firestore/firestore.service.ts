import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {IGameData, GameData} from '../../clases/gamedata';
import { Observable } from 'rxjs';
import { Iset,Set } from '../../clases/sets';
import { AngularFireStorage } from '@angular/fire/storage';
import { ObserversModule } from '@angular/cdk/observers';
import * as firebase from 'firebase';


import { User } from '../../user';




@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  private afs:AngularFirestoreCollection<Set>;

  //FirestoreCollection
  private afsU:AngularFirestoreCollection<User>;


  private cookies_partidas:AngularFirestoreCollection<any>;
  
  constructor(private firestore: AngularFirestore, public storage:AngularFireStorage) {

    this.cookies_partidas=this.firestore.collection('cookies_partidas');

  

    //Colección usuarios
    this.afsU=this.firestore.collection('usuarios');
  
  }



//Funciones usuarios

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

  public getGameCookie(id:string):Promise<any>{
    return this.cookies_partidas.doc(id).get().toPromise();
  
  }

  public updateGameCookie(data:GameData){
    return this.cookies_partidas.doc(data.id).set(Object.assign({}, data));
  }




public getStorage(){
  return this.storage;
}





  public getSets():Observable<Set[]>
  {
    return this.firestore.collection<Set>('sets',ref=>ref.orderBy('id')).valueChanges();

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
