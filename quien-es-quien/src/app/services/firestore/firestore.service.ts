import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Iset,Set } from '../../sets';



@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  private afs:AngularFirestoreCollection<Set>;
  
  constructor(private firestore: AngularFirestore) {

    this.afs=this.firestore.collection('sets');

  }

  public getSets():Observable<Set[]>
  {
    return this.firestore.collection<Set>('sets',ref=>ref.orderBy('id')).valueChanges();
    
  }

}  

