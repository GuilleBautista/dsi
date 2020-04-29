import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {IGameData, GameData} from '../../clases/gamedata';
import { Observable } from 'rxjs';
import { Iset,Set } from '../../clases/sets';
import { AngularFireStorage } from '@angular/fire/storage';
import { ObserversModule } from '@angular/cdk/observers';
import * as firebase from 'firebase';



@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  private cookies_partidas:AngularFirestoreCollection<any>;
  
  constructor(private firestore: AngularFirestore, public storage:AngularFireStorage) {

    this.cookies_partidas=this.firestore.collection('cookies_partidas');

  }

  public getGameCookie(id:string):Promise<any>{
    return this.cookies_partidas.doc(id).get().toPromise();
  
  }

  public updateGameCookie(data:GameData){
    return this.cookies_partidas.doc(data.id).set(Object.assign({}, data));
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

