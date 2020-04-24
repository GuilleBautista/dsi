import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Set} from '../sets';
import {FirestoreService} from '../services/firestore/firestore.service';
import { Subscription, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  } from 'firebase/storage';
import {AngularFireStorage} from '@angular/fire/storage';


@Component({
  selector: 'app-set-selector',
  templateUrl: './set-selector.component.html',
  styleUrls: ['./set-selector.component.scss']
})



export class SetSelectorComponent implements OnInit {
  
  //Matriz para el tablero
  public Sets:Array<any>;
  
  
  public url:string;

  constructor(public router: Router, public route: ActivatedRoute, 
    private firestoreService: FirestoreService,private _snackBar: MatSnackBar, private storage:AngularFireStorage
    ) {

    const ref = this.storage.ref('sets/1.png');
    const obsurl = ref.getDownloadURL();


    obsurl.subscribe(char=>{
      this.url=char;
    })

    this.Sets=[
      {
        "route": "",
        "id": "/characters/set0"
       },
       {
        "route": 'assets/sets/1.png (copy)', 
        "id": "/characters/set1"
       },
       {
         "route": 'assets/sets/2.png',
         "id": "/characters/set2"
       }
      ];

      obsurl.subscribe(char=>{
        this.url=char;
        this.Sets[0].route=this.url;
      })
      
     
  }

  ngOnInit(): void {
    
  }

  select(id:string){
    this.router.navigate(['/game'],     // En URL y participan en el routing.
    //{param_extra1:'XXX',param_extra2:57}],  // Se pasan codificados en la url.
    { state: { param_not_in_url: id }}   // No se muestran en la URL
    );
  }

}
