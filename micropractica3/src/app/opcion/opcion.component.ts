import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-opcion',
  templateUrl: './opcion.component.html',
  styleUrls: ['./opcion.component.css']
})
export class OpcionComponent implements OnInit {


  @Input() nombre:string;
  @Input() id1:number;
  @Input() id2:number;

  constructor() {
    this.nombre="";
    this.id1=0;
    this.id2=0;
  }


  ngOnInit(): void {
  }

}
