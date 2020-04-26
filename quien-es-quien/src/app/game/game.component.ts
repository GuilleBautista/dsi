import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { firestore } from 'firebase';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  //Matriz para el tablero
  public matrix:Array<Array<any>>;
  public set:Number=0;

  constructor(private fs: FirestoreService) {
    if(history.state.param_not_in_url != undefined){
      this.set=history.state.param_not_in_url;
    }
    this.matrix=[];

    for(let i=0; i<4; i++){
      //Añadimos una nueva fila a la matriz
      this.matrix.push( [] ) ;
      for(let j=0; j<6; j++){
        this.fs.getImg("/characters/set"+this.set+"/"+(1+i+j*4)+".svg").subscribe(url=>{
          //Creamos una estructura npc con la url correspondiente
          let npc={
            "url": url,
            "state":0
          }
          //La añadimos a la matriz
          this.matrix[i].push(npc);
         })
       

        
      }
    }

    //Para rellenar la matriz
    
   }

  ngOnInit(): void {
    //Cogemos las imagenes de la base de datos
    // for(let i=0; i<4; i++){
    //   for(let j=0; j<6; j++){
    //     this.fs.getImg("/characters/set"+this.set+"/"+(1+i+j*4)+".svg").subscribe(url=>{
    //      this.matrix[i][j].url=url;
    //      console.log(this.matrix[i][j].url)
    //     })
        
    //   }
    // }
  }


}
