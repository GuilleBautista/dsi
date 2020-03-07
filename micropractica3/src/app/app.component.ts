import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'micropractica3';

  nombreLista1:string;
  nombreLista2:string;

  constructor(){
    this.nombreLista1 = "Comunidad";
    this.nombreLista2 = "Provincia";
  }


}
