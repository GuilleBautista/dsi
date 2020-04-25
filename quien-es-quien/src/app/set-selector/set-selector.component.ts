import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FirestoreService} from '../services/firestore/firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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

    this.Sets=[];

    for(let i=0; i<3; i++){
      let ref = this.storage.ref('sets/'+i+'.png');
      let obsurl = ref.getDownloadURL();
      obsurl.subscribe(char=>{
        this.url=char;
      })

      let set={
        "route":"",
        "id" : i
      }

      this.Sets.push(set);

      obsurl.subscribe(char=>{
        this.url=char;
        this.Sets[i].route=this.url;
      })

    }

     
      
     
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
