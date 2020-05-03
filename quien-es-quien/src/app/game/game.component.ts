import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { firestore } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Game } from '../game';
import { GlobalService } from '../services/global/global.service';


import { CookieService } from 'ngx-cookie-service';


import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  //Matriz para el tablero
  public matrix:Array<Array<any>>;
  public set:number=0;
  public x_picture:string="";


  //Mensajes chat
  public chat:Array<any>;

  public newMsg:string;

  private afs:AngularFirestoreCollection<Game>;

  public game: Game;


  constructor(private fs: FirestoreService, private firebase: AngularFirestore, private snackBar: MatSnackBar, private cookieService: CookieService, public global: GlobalService) {
    if(history.state.param_not_in_url != undefined){
      this.set=history.state.param_not_in_url;
    }
    this.matrix=[];

    //this.npc_list=fs.getFiles('characters/set0');

    //Para rellenar la matriz

    for(let i=0; i<4; i++){
      this.matrix.push([]);
      for(let j=0; j<6; j++){

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

    this.initializeMatrix();

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

  /*
  Funcion para dar valor a las imagenes de los personajes de la matriz.
  Esta funcion asume que los unicos elementos que hay en la carpeta del set a acceder son las imagenes del set en cuestion.
  */
  private initializeMatrix(){
    //Cogemos las imagenes de la base de datos
    let i=0, j=0;

    //Accedemos a la carpeta del set correspondiente
    this.fs.getFiles("/characters/set"+this.set).subscribe(
      result=>{
        //Cogemos todos los elementos de dentro
        for(let file of result.items){ //items para archivos, prefixes para carpetas
          file.getDownloadURL().then(url=>{
            //Asignamos a cada elemento de la matriz la url de uno de estos elementos
            this.matrix[i][j].url=url;
            i+=1;
            if(i>=4){ i=0; j+=1; }
          });
        }
      })
  }

  public update(i:number, j:number){
    if(this.matrix[i][j].state==0){
      this.matrix[i][j].state=1;
    }
    else{
      this.matrix[i][j].state=0;
    }

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
