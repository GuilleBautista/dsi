import { Component, OnInit, Input, QueryList, ContentChild, ContentChildren } from '@angular/core';

import { OpcionComponent } from '../opcion/opcion.component';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  @ContentChildren(OpcionComponent) opciones!:QueryList<OpcionComponent>;


  @Input() nombre1:string;
  @Input() nombre2:string;

  valor:string;

  opciones1:Array<string>;
  opciones2:Array<Array<string>>;

  parentId:Array<number>;


  constructor() {
    this.nombre1="";
    this.nombre2="";

    this.opciones1=[];
    this.opciones2=[];

    this.parentId=[];

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    for(let opt of this.opciones.toArray()){
      if(opt.id2 == 0){
        this.opciones1.push(opt.nombre);
        this.opciones2.push([]);
        this.parentId.push(opt.id1);
      }
      else{
        for(let i = 0; i < this.parentId.length; i++){
          if( opt.id1 == this.parentId[i]){
            this.opciones2[i].push(opt.nombre);
          }
        }

      }
    }
  }

}
