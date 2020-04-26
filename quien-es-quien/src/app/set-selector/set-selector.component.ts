import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FirestoreService} from '../services/firestore/firestore.service';



@Component({
  selector: 'app-set-selector',
  templateUrl: './set-selector.component.html',
  styleUrls: ['./set-selector.component.scss']
})



export class SetSelectorComponent implements OnInit {
  
  //Matriz para el tablero
  public Sets:Array<any>;
  
  
  constructor(public router: Router, public route: ActivatedRoute, private fs: FirestoreService) {

    this.Sets=[];
     
  }

  ngOnInit(): void {
    for(let i=0; i<3; i++){
      
      this.fs.getImg("sets/"+i+".png").subscribe(url=>{
        let set={
          "route":url,
          "id" : i
        }
        this.Sets.push(set);
      })

    }
  }

  select(id:string){
    this.router.navigate(['/game'],     // En URL y participan en el routing.
    //{param_extra1:'XXX',param_extra2:57}],  // Se pasan codificados en la url.
    { state: { param_not_in_url: id }}   // No se muestran en la URL
    );
  }

}
