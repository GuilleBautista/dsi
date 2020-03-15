import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  
  public matrix:Array<Array<number>>;

  constructor() {
    this.matrix=[];

    for(let i=0; i<4; i++){
      this.matrix.push( [] ) ;
      for(let j=0; j<4; j++){
        this.matrix[i].push(0);
      }
    }
   }


  ngOnInit(): void {
   
    

  }
}
