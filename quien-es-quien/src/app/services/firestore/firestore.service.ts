import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Iset,Set } from '../../sets';
import { AngularFireStorage } from '@angular/fire/storage';
import { ObserversModule } from '@angular/cdk/observers';
import * as firebase from 'firebase';



@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  private afs:AngularFirestoreCollection<Set>;
  
  constructor(private firestore: AngularFirestore, public storage:AngularFireStorage) {

    this.afs=this.firestore.collection('sets');

  }

  public getSets():Observable<Set[]>
  {
    return this.firestore.collection<Set>('sets',ref=>ref.orderBy('id')).valueChanges();
    
  }

  public getImg(img:string):Observable<string>{
    let ref = this.storage.ref(img);
    
    return ref.getDownloadURL();
    
  }

  

}  

