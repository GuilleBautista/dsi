import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  //Matriz para el tablero
  public matrix:Array<Array<any>>;
  public set:Number=0;
  public npc_list:string[];

  constructor(private fs: FirestoreService) {
    if(history.state.param_not_in_url != undefined){
      this.set=history.state.param_not_in_url;
    }
    this.matrix=[];

    //this.npc_list=fs.getFiles('characters/set0');
    console.log(this.npc_list)

    //Para rellenar la matriz

    for(let i=0; i<4; i++){
      this.matrix.push( [] ) ;
      for(let j=0; j<6; j++){
        console.log(this.npc_list[i+j*4])

        let npc={
          "url":this.npc_list[i+j*4],
          "state":0
        }
        this.matrix[i].push(npc);
      }
    }




   }

  ngOnInit(): void {

      /*for(let i=0; i<4; i++){
        this.matrix.push( [] ) ;

        for(let j=0; j<6; j++){

        console.log(this.npc_list[i+j*4]);

        this.fs.getImg(this.npc_list[i+j*4]).subscribe(url=>{

          let npc={
            "src": url,
            "state":0
          }

          this.matrix[i].push(npc);
        })


      }

    }*/

  }


}
