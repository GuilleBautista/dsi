import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal-page',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss']
})
export class PrincipalPageComponent implements OnInit {

  /*
  * En este componente no es necesario cargar las sesiones
  * ya que se han cargado en el componente del header, que se 
  * inicia antes que este.
  * 
  * Si fuera necesario cargarlas en el futuro, hay que tener en 
  * cuenta que al igual que en el header no es necesario redirigir a la pagina
  * en la que se encontraba el usuario previamente.
  */

  constructor( ) { }

  ngOnInit(): void {
  }

}
