import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'micropractica3';

  //Nombres de las listas
  nombreLista1:string;
  nombreLista2:string;

  //Id de cada opcion
  valor1:string;
  valor2:string;

  //Constructor
  constructor(){
    this.nombreLista1 = "Comunidad";
    this.nombreLista2 = "Provincia";
    this.valor1="";
    this.valor2="";
  }

  //Metodo para actualizar el id de cada opcion, los actualizamos con los parametros que manda el EventEmitter
  actualizar($event){
    this.valor1= $event[0];
    this.valor2= $event[1];
  }

  //Metodo para mostrar en un alert los id
  infoId(){
    alert(this.nombreLista1 + ": " + this.valor1 + "\n" + this.nombreLista2 + ": " + this.valor2)
  }

}
