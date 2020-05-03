import { Component, OnInit } from '@angular/core';

import { FirestoreService } from '../services/firestore/firestore.service';
import { GlobalService } from '../services/global/global.service';
import { Game } from '../game';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-principal-page',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss']
})
export class PrincipalPageComponent implements OnInit {

  public game: Game;

  constructor(private fs: FirestoreService, public global: GlobalService, private cookieService: CookieService) {}

  ngOnInit(): void {
  }



  //Función para crear una nueva partida 
  public async newGame(){

    this.game = new Game(this.global.actualUser.id, "", "", "", 0, [], "");
    let id = await this.fs.createGame(this.game);

    //Creamos la cookie partida para guardar el id de la nueva partida
    this.cookieService.set("cookieGame", id);
  }


}
