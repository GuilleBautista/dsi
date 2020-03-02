import { Component, OnInit, Output } from '@angular/core';
import {Form, FormsModule} from '@angular/forms';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.css'],

})


export class ComunidadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() public comunity:string;


  select(value:string){
    this.comunity=value;
  }

}
