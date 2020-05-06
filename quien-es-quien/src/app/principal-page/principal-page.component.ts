import { Component, OnInit } from '@angular/core';

import { FirestoreService } from '../services/firestore/firestore.service';
import { GlobalService } from '../services/global/global.service';
import { CookieService } from 'ngx-cookie-service';

import { Game } from '../clases/game';

import { cookie_time } from '../global';



@Component({
  selector: 'app-principal-page',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss']
})
export class PrincipalPageComponent implements OnInit {

  public game: Game;

  constructor(private fs: FirestoreService, public global: GlobalService, private cookieService: CookieService) {}
  /*
  * En este componente no es necesario cargar las sesiones
  * ya que se han cargado en el componente del header, que se
  * inicia antes que este.
  *
  * Si fuera necesario cargarlas en el futuro, hay que tener en
  * cuenta que al igual que en el header no es necesario redirigir a la pagina
  * en la que se encontraba el usuario previamente.
  */

  ngOnInit(): void {
    //Tras cargar cualquier pagina se cambia la cookie a la de la propia pagina
    //Esto se hace para evitar incoherencias si le damos a atras en el navegador
    this.cookieService.set("page", "/principalpage", cookie_time);
  }



  //Función para crear una nueva partida  ??
  public async newGame(){

    let game={
      id:this.global.actualUser.id,
      id_creator:"",
      id_joined:"",
      character_creator:"",
      set:0,
      chat:[],
      character_joined:"",
      //TODO: cambiar la forma de generar esto
      room: (Math.floor(Math.random()*100000)).toString()
    }

    this.game = new Game(game);

    let id = await this.fs.createGame(this.game);

    //Creamos la cookie partida para guardar el id de la nueva partida
    this.cookieService.set("cookieGame", id, cookie_time);
    //El jugador que crea la partida es el player 1
    this.cookieService.set("player", "1");

    this.global.renewCookies(this.cookieService);

  }


}
