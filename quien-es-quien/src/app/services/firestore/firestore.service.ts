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
    console.log(img);
    
    return ref.getDownloadURL();
    
  }

  public getFiles(path:string){
    let result=[]

    var storageRef = firebase.storage().ref("characters/set0");


    // Now we get the references of these images
    storageRef.listAll().then(function(result) {
      result.items.forEach(function(imageRef) {
        // And finally display them
        displayImage(imageRef);
      });
    }).catch(function(error) {
      // Handle any errors
    });

    function displayImage(imageRef) {
      imageRef.getDownloadURL().then(function(url) {
        result.push(url);
      }).catch(function(error) {
        // Handle any errors
      });
    }
    return result
  }

}  

