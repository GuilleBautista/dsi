import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FirestoreService} from '../services/firestore/firestore.service';

import { GlobalService } from '../services/global/global.service';



@Component({
  selector: 'app-set-selector',
  templateUrl: './set-selector.component.html',
  styleUrls: ['./set-selector.component.scss']
})



export class SetSelectorComponent implements OnInit {

  //Matriz para el tablero
  public Sets:Array<any>;

  //Imagen candado
  public lock_picture:string;


  //Constructor
  constructor(public router: Router, public route: ActivatedRoute, private fs: FirestoreService, public global: GlobalService) {

    this.Sets=[];

    //Cargamos la imagen del candado para marcar el set bloqueado
    this.fs.getImg("img/lock.svg").subscribe(url=>{
      this.lock_picture=url;
    });

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
    //Creamos una estructura de datos para devolver
    let data={
      set: id,
      //Si esta eligiendo set es el jugador 1
      player:"1"   
    }
    this.router.navigate(['/npc-selector'],
      { state: { data: data }}   // No se muestran en la URL
    );
  }

}
