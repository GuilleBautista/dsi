import { Component, OnInit, Input, Output, QueryList, ContentChild, ContentChildren, EventEmitter } from '@angular/core';
import { OpcionComponent } from '../opcion/opcion.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  //Lista de componentes del tipo opcion que se ecuentran dentro del componente lista
  @ContentChildren(OpcionComponent) opciones!:QueryList<OpcionComponent>;

  //EventEmitter 'cambio'
  @Output() cambio = new EventEmitter();

  //Inputs del nombre de cada desplegable
  @Input() nombre1:string;
  @Input() nombre2:string;

  opciones1:Array<string>; //Array de string para almacenar las opciones del primer desplegable
  opciones2:Array<Array<string>>; //Array de arrays de string para almacenar las opciones del segundo desplegable

  parentId:Array<number>; //Array de numeros para almacenar los id de las opciones del primer desplegable
  childId:Array<Array<number>>; //Array de arrays de numeros para almacenar los id de las opciones del segundo desplegable

  //Array de string para almacenar los id de las opciones seleccionadas de cada desplegable
  public valores:Array<string> = ["", ""];

  //Constructor
  constructor() {
    this.nombre1="";
    this.nombre2="";

    this.opciones1=[];
    this.opciones2=[];

    this.parentId=[];
    this.childId=[];
  }

  ngOnInit(){
  }

  ngAfterViewInit(){
    //Recorremos la lista opciones del tipo componente opcion
    for(let opt of this.opciones.toArray()){
      //Si el id2 es 0 significa que es una opcion de la lista opciones1 y por ello introducimos su nombre, en parentId introducimos su id1
      //En opciones2 y childId introducimos un array vacio
      if(opt.id2 == 0){
        this.opciones1.push(opt.nombre);
        this.opciones2.push([]);
        this.parentId.push(opt.id1);
        this.childId.push([]);
      }
      //Sino, recorremos parentId, si el id1 de la opcion coincide con un id de parentId entonces introducimos en esa misma posicion pero de opciones2 su nombre
      else{
        for(let i = 0; i < this.parentId.length; i++){
          if( opt.id1 == this.parentId[i]){
            this.opciones2[i].push(opt.nombre);
            this.childId[i].push(opt.id2);  
          }
        }

      }
    }
  }

  cambioOp1(){
    //Guardamos el index que tiene en opciones1 la opcion seleccionada actualmente en el primer desplegable
    let index1 = this.opciones1.indexOf(this.valores[0]);

    //Guardamos los id del primer desplegable en 'a' y del segundo (el de la primera opcion) en 'b'
    let a = this.parentId[index1];
    let b = this.childId[index1][0];

    //Llamamos al EventEmitter cambio y emitimos 'a' y 'b'
    this.cambio.emit([a, b]);
  }

  cambioOp2(){
    //Guardamos el index que tiene en opciones1 la opcion seleccionada actualmente en el primer desplegable
    let index1 = this.opciones1.indexOf(this.valores[0]);
    //Guardamos el index que tiene en opciones2 la opcion seleccionada actualmente en el segundo desplegable
    let index2 = this.opciones2[index1].indexOf(this.valores[1]);

    //Guardamos los id del primer desplegable en 'a' y del segundo en 'b'
    let a = this.parentId[index1];
    let b = this.childId[index1][index2];

    //Llamamos al EventEmitter cambio y emitimos 'a' y 'b'
    this.cambio.emit([a, b]);
  }




}
