import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Iset,Set } from '../../sets';
import { AngularFireStorage } from '@angular/fire/storage';
import { ObserversModule } from '@angular/cdk/observers';
import * as firebase from 'firebase';


import { User } from '../../user';
import { Game } from '../../game';





@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  private afs:AngularFirestoreCollection<Set>;

  //FirestoreCollection
  private afsU:AngularFirestoreCollection<User>;
  private afsG:AngularFirestoreCollection<Game>;



  constructor(private firestore: AngularFirestore, public storage:AngularFireStorage) {

    this.afs=this.firestore.collection('sets');

    //Colección usuarios
    this.afsU=this.firestore.collection('usuarios');

    //Colección partidas
    this.afsG=this.firestore.collection('game');
  }



//Funciones partida

public createGame(data: Game):Promise<string>{
  data.idGame=this.firestore.createId();
  return this.afsG.doc(data.idGame).set({... data}).then(r=>{
    return data.idGame;
  });
}


public getGame(id: string):Promise<Game>{
  return this.afsG.doc(id).get().toPromise().then(r=>{
    return r.data() as Game;
  });

}

public updateGame(data:Game){
  return this.afsG.doc(data.idGame).set(Object.assign({}, data));
}





//Funciones usuarios

  public createUser(data: User):Promise<string>
  {
    data.id=this.firestore.createId();
    return this.afsU.doc(data.id).set({... data}).then(r=>{
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
