import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  //Matriz para el tablero
  public matrix:Array<Array<number>>;
  public set:Number;

  constructor() {
    this.set=history.state.param_not_in_url;
    this.matrix=[];

    //Para rellenar la matriz
    for(let i=0; i<3; i++){
      this.matrix.push( [] ) ;
      for(let j=0; j<8; j++){
        this.matrix[i].push(0);
      }
    }
   }

  ngOnInit(): void {
    
  }


}
