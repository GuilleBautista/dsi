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

  public setfb:Set[];
  public s_sets:Subscription;

  public ref:any;
  
  public obsurl: Observable<string | null>;
  public url:string;

  constructor(public router: Router, public route: ActivatedRoute, 
    private firestoreService: FirestoreService,private _snackBar: MatSnackBar, private storage:AngularFireStorage
    ) {

    this.Sets=[
      {
        "route": 'assets/sets/1.png',
        "id": 0
       },
       {
        "route": 'assets/sets/1.png (copy)', 
        "id": 1
       },
       {
         "route": 'assets/sets/2.png',
         "id": 2
       }
      ];

      const ref = this.storage.ref('sets/set0/1.svg');
      this.obsurl = ref.getDownloadURL();

      const obssubs=this.obsurl.subscribe(char=>{
        this.url=char;
        console.log(this.url);
      })
      
  }

  ngOnInit(): void {
    this.s_sets=this.firestoreService.getSets().subscribe(data=>{
      this.setfb=data;
    });
  }

  select(id:Number){
    this.router.navigate(['/game'],     // En URL y participan en el routing.
    //{param_extra1:'XXX',param_extra2:57}],  // Se pasan codificados en la url.
    { state: { param_not_in_url: id }}   // No se muestran en la URL
    );
  }

}
