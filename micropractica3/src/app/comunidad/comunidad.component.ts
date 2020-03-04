import { Component, OnInit, Output, Input} from '@angular/core';
import {Form, FormsModule} from '@angular/forms';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.css'],

})


export class ComunidadComponent implements OnInit {

  constructor() {
    this.comunities=[
      "Madrid",
      "Aragon",
      "Navarra",
      "Castilla-Leon"
    ];
    this.provincias=[
      ["Madrid"],["Teruel", "Zaragoza", "Huesca"],["Navarra"],["Ávila", "Salamanca", "Zamora", "León", "Palencia", "Burgos", "Soria", "Valladolid", "Segovia"] 
    ];
    this.provincia=2;

    this.aux=this.provincias[this.provincia];
   }

  ngOnInit(): void {
  }

  public provincias:string[][];

  @Input() public provincia:number;

  @Output() public selected:string;

  @Output() public comunities:string[];

  @Output() public aux:string[];

  select(value:string, index:number){
    this.selected=value;
    this.provincia=index;
    this.aux=this.provincias[this.provincia];

  }

}
