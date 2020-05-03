import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { firestore } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Game } from '../game';
import { GlobalService } from '../services/global/global.service';


import { CookieService } from 'ngx-cookie-service';


import {MatSnackBar} from '@angular/material/snack-bar';

import { Router, ActivatedRoute } from '@angular/router';
import {debugging as debug, height, width} from '../global';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  //Matriz para el tablero
  public matrix:Array<Array<any>>;
  public set:number=0;
  public playerNpc:string;
  public x_picture:string;
  public goal:string="";

  public selecting:boolean=false;

  public debug:boolean=debug;
  public default:boolean=false;
  //El objetivo por defecto es yasmin. TODO: conseguir el objetivo de una forma mejor



  public chat:Array<any>;
  public newMsg:string;
  private afs:AngularFirestoreCollection<Game>;
  public game: Game;


  constructor(private fs: FirestoreService, public router: Router, public route: ActivatedRoute, private cookieService: CookieService, private firebase: AngularFirestore, private snackBar: MatSnackBar, public global: GlobalService) {

    if(history.state.data != undefined ){
      //Comprobamos si se han pasado los parámetros por la url.

      this.set=history.state.data.set;//Cogemos el set de la url
      this.playerNpc=history.state.data.npc;//Cogemos el personaje de la url
      //Creamos una cookie TODO:generar los id de las cookies
      this.setCookie();
    }
    else{
      if(this.cookieService.get('gameid')==""){
        //Si estamos debugeando aceptamos los valores por defecto.
        if(!debug){
          //Si no recibimos datos vamos a la pagina principal
          this.router.navigate(['/principalpage']);
        }
        else{
          this.default=true;
        }

      }
      else{
      this.getCookie();
      }
    }



    //Inicializamos una matriz de personajes
    this.matrix=[];
    for(let i=0; i<height; i++){
      this.matrix.push([]);
      for(let j=0; j<width; j++){

        //cada elemento de la matriz es un npc con url de imagen y estado
        let npc={
          "url": "",
          "state":0
        };

        this.matrix[i].push(npc);
      }
    }

    this.fs.getImg("img/x.svg").subscribe(url=>{
      this.x_picture=url;
    });



    this.newMsg="";
    this.afs=this.firebase.collection('game');

   }


  async ngOnInit() {

    if(this.default ){
      this.initializeMatrix(
        this.selectRandomNpc(),
        this.selectRandomNpc()
      )
    }else{
      this.initializeMatrix(this.selectRandomNpc());
    }

    //Guardamos en id el valor de la cookieGame (id de la partida actual) y guadamos en this.game la partida de la BD con este id
    let id = this.cookieService.get("cookieGame");
    this.game = await this.fs.getGame(id);
    this.game.set = this.set;

    //FALTA RELLENAR LOS CAMPOS ID_JOINED, CHARACTER_CREATOR Y JOINED

    this.fs.updateGame(this.game);


    //Actualizamos los datos de la colección game de firebase con onSnapshot
    this.firebase.firestore.collection('game').onSnapshot(snapshot =>{
      console.log(snapshot.docChanges());
      //Cambios de la colección
      let changes = snapshot.docChanges();
      //Recorro las partidas dentro de game
      changes.forEach(change => {
      //Si encuentro una partida con el mismo id que mi partida actual accedo a ella
       if (change.doc.data().idGame == this.game.idGame) {

         this.chat = [];
          console.log(change.doc.data());
          console.log(change.doc.data().chat);

          //Compruebo si tengo mensajes del otro jugador
          for (let m = 0; m < change.doc.data().chat.length; m+=2) {
              //Si encuentro un 1 en el array chat de la BD significa que en la siguiente posición tengo un mensaje del otro jugador y lo almaceno en this.chat
              if (change.doc.data().chat[m] == "1") {
                this.chat.push([1, change.doc.data().chat[m+1]]);
              }
              //Si encuentro un 0 en el array chat de la BD significa que en la siguiente posición tengo un mensaje ya enviado mío y lo almaceno en this.chat
              else if (change.doc.data().chat[m] == "0"){
                this.chat.push([0, change.doc.data().chat[m+1]]);
              }
          }

       }

     })
    });


  }

  //----------------------------Funciones auxiliares---------------------------------------

  /*
  Funcion para dar valor a las imagenes de los personajes de la matriz.
  Esta funcion asume que los unicos elementos que hay en la carpeta del set a acceder son las imagenes del set en cuestion.
  */
  private initializeMatrix(player?:any, goal?:any){
    //Indices para recorrer la matriz
    let i=0, j=0;

    //Accedemos a la carpeta del set correspondiente
    this.fs.getFiles("/characters/set"+this.set).subscribe(
      result=>{
        //Cogemos todos los elementos de dentro
        for(let file of result.items){ //items para archivos, prefixes para carpetas
          file.getDownloadURL().then(url=>{
            //Asignamos a cada elemento de la matriz la url de uno de estos elementos
            this.matrix[i][j].url=url;

            if(this.default){
              if(i==player.i && j==player.j){
                this.playerNpc=url;
              }
              if(i==goal.i && j==goal.j){
                this.goal=url;
              }
            }

            i+=1;
            if(i>=4){ i=0; j+=1; }

          });
        }
      })
  }

  private selectRandomNpc():any{
    let i= Math.floor(Math.random()*height);
    let j= Math.floor(Math.random()*width);

    let result={
      i:i,
      j:j
    }

    return result;
  }

  private setCookie(){

    let data={
      id:"1",
      set:this.set,
      goal:this.goal,
      npc:this.playerNpc

    }

    this.fs.updateGameCookie(data as GameData);

    this.cookieService.set('gameid', data.id );

  }

  private getCookie(){
    let gamedata = this.fs.getGameCookie(
      this.cookieService.get('gameid')
      );

    gamedata.then(result=>{
      let gd = result.data() as GameData;

      this.set=gd.set;
      this.playerNpc=gd.npc;
      this.goal=gd.goal;
    })
  }

  //----------------------------Interaccion con el tablero:--------------------------------

  /*
  Se ejecuta al hacer click sobre un personaje o una X.
  Recibe como argumentos la fila y la columna del mismo.
  Tacha o destacha a un personaje.
  Si se está enviando un resultado comprueba si el personaje es el objetivo,
    e indica al usuario si ha ganado o perdido. Tras esto acaba la partida.
  */
  public onClickNpc(i:number, j:number){
    if(!this.selecting){
      if(this.matrix[i][j].state==0){
        this.matrix[i][j].state=1;
      }
      else{
        this.matrix[i][j].state=0;
      }
    }
    else{
      if(this.matrix[i][j].url==this.goal){
        //Has ganado
        alert("WINNER WINNER CHICKEN DINNER !!");
        this.end();
      }
      else{
        //Has perdido
        alert("Perdiste compañero");
        this.end();
      }
    }
  }

  //Cambia el estado de selecting
  public toggleSelecting(){
    this.selecting=!this.selecting;
  }

  //----------------------------Funciones del juego----------------------------

  //Funcion a ejecutar cuando acaba la partida
  private end(){
    //TODO: Hacer algo mas al acabar el juego
    this.router.navigate(['/principalpage']);
  }


  //Función que muestra mensaje cuando pulsas en el botón de 'RESOLVER'
  public openSnackBar() {
     this.snackBar.open("Selecciona el personaje misterioso que crees que tiene tu rival", "", {
       duration: 8000,
   });

  }





  //Función para añadir al array del chat un nuevo mensaje que hemos escrito
  public sendMsg(){

    if (this.global.actualUser.id == this.game.id_creator) {
      this.game.chat.push("0");
      this.game.chat.push(this.newMsg);

    }
    else if(this.global.actualUser.id == this.game.id_joined){
      this.game.chat.push("1");
      this.game.chat.push(this.newMsg);

    }
    this.newMsg="";
    this.fs.updateGame(this.game);
  }







}
