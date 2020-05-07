import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { firestore } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Game } from '../clases/game';
import { GlobalService } from '../services/global/global.service';


import { CookieService } from 'ngx-cookie-service';


import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';


import { Router, ActivatedRoute } from '@angular/router';
import {debugging as debug, height, width, cookie_time} from '../global';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  //Componentes locales de la partida
  public matrix:Array<Array<any>>;
  public debug:boolean=debug;
  public default:boolean=false;
  public selecting:boolean=false;
  public x_picture:string;
  private sent:boolean=false;
  private first_connection:boolean=true;

  //Datos de la partida de la bbdd
  public game: Game;
  public player:string;
  public playerNpc:string;
  public chat:Array<Array<string>>;


  constructor(private fs: FirestoreService, public router: Router, public route: ActivatedRoute,
    private cookieService: CookieService, private firebase: AngularFirestore,
    private snackBar: MatSnackBar, public global: GlobalService,
    public dialogW: MatDialog, public dialogT: MatDialog, public dialogL: MatDialog) {

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

    //Inicializamos el chat local
    this.chat=[];

    //Guardamos el id de la partida actual en una variable temporal
    let gameid=this.cookieService.get("cookieGame")

    //Comprobamos si estaba en una partida
    if(gameid==""){ //Si no lo estaba creamos una nueva

      //Si no estamos en una partida comprobamos si hemos recibido datos de la url
      if (history.state.data == undefined){
        //Si no se han pasado datos por la url damos error
        console.log("ERROR: algo ha ido mal en la carga de la partida");

        //Actualizamos las cookies de sesion
        this.cookieService.set("page", '/principalpage', cookie_time);
        this.global.renewCookies(this.cookieService);

        //Redirigimos a la pagina principal
        this.router.navigate(['/principalpage']);


      }
      else if(this.cookieService.get("player")=="1"){//Si se han recibido datos y eres el jugador 1 se cargan y se crea una partida

        let set=history.state.data.set;//Cogemos el set de la url
        this.playerNpc=history.state.data.npc;//Cogemos el personaje de la url
        this.player=history.state.data.player;//Cogemos el jugador de la url

        //Creamos una nueva partida con los datos de la url
        this.game=new Game({
          id_creator:this.cookieService.get("uid"),
          id_joined:  "",
          set:  set,
          character_creator:  this.playerNpc,
          character_joined: "",
          chat0:  "",
          chat1:  "",
          //TODO: generar las salas mejor Quiza en la nube si hay tiempo?
          room: (Math.floor(Math.random()*1000000)).toString(),
          //TODO
          idGame:"",
          winner:""
        })
        //Creamos la partida en la bbdd
        this.fs.createGame(this.game);

        //Obtenemos las imagenes de la base de datos
        this.initializeMatrix();

        //Creamos una subscripcion de la partida a la bbdd
        this.watchChanges();

        this.cookieService.set("cookieGame", this.game.idGame, cookie_time);

      }
      else{//Si es tu primera vez y eres el jugador 0
        let set=history.state.data.set;//Cogemos el set de la url
        this.playerNpc=history.state.data.npc;//Cogemos el personaje de la url
        this.player=history.state.data.player;//Cogemos el jugador de la url
        gameid=history.state.data.gameid;

        this.fs.getGame(gameid).then(async game=>{
          //Creamos una nueva partida con los datos de la url
          this.game=new Game({
            id_creator: game.id_creator,
            id_joined:  this.cookieService.get("uid"),
            set:  set,
            character_creator: game.character_creator,
            character_joined: this.playerNpc,
            chat0:  "'El jugador 2 se ha unido a la sala'",
            chat1:  "",
            //TODO: generar las salas mejor Quiza en la nube si hay tiempo?
            room: game.room,
            //TODO
            idGame:gameid,
            winner:""
          })

          //Creamos la partida en la bbdd
          await this.fs.updateGame(this.game);

          //Obtenemos las imagenes de la base de datos
          this.initializeMatrix();

          //Creamos una subscripcion de la partida a la bbdd
          this.watchChanges();

          this.cookieService.set("cookieGame", this.game.idGame, cookie_time);
          this.cookieService.set("player", this.player, cookie_time);

        });

      }

    }
    else{//Si las cookies estan inicializadas se carga la partida
      console.log(gameid);

      this.fs.getGame(gameid).then(game=>{
      this.game=game as Game;
      this.player=this.cookieService.get("player");
      this.cookieService.set("player", this.player, cookie_time);



      if(this.player=="0"){
        this.playerNpc=this.game.character_joined;
      }else{
        this.playerNpc=this.game.character_creator;
      }

      //Obtenemos las imagenes de la base de datos
      this.initializeMatrix();

      //Creamos una subscripcion de la partida a la bbdd
      this.watchChanges();


    }).catch(error=>{
      console.log("Error obteniendo la partida de la base de datos", error)
    })


    }

    if(this.game!=undefined){
      this.cookieService.set("cookieGame", this.game.idGame, cookie_time);

    }
    if(this.player!=undefined){
      this.cookieService.set("player", this.player, cookie_time);
    }
    this.global.renewCookies(this.cookieService);

    //Cargamos la imagen de la x para tachar personajes
    this.fs.getImg("img/x.svg").subscribe(url=>{
      this.x_picture=url;
    });

   }



  //----------------------------Funciones auxiliares---------------------------------------

  /*
  * Funcion para dar valor a las imagenes de los personajes de la matriz.
  * Esta funcion asume que los unicos elementos que hay en la carpeta del set a acceder son las imagenes del set en cuestion.
  * Asume tambien que se ha inicializado una partida.
  */
  private initializeMatrix(){
    //Indices para recorrer la matriz
    let i=0, j=0;

    //Accedemos a la carpeta del set correspondiente
    this.fs.getFiles("/characters/set"+this.game.set).subscribe(
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

  /*
  * Funcion para subscribir al componente a los cambios en la base de datos
  * El objetivo de la funcion es ver los cambios en el chat
  */
  private watchChanges(){
    //Creamos una subscripcion a los cambios en la partida de la bbdd
    let msg="";
    let foe="";

    this.firebase.firestore.collection('game').doc(this.game.idGame).onSnapshot(snapshot=>{
      //Si el cambio no es un mensaje nuestro o nuestra primera conexión
      if(!this.sent && !this.first_connection && snapshot.data()!=undefined){
        console.log(snapshot.data());

        //Comprobamos si el cambio ha sido de tipo ganador
          if(snapshot.data().winner!=""){

          //Si el ganador no somos nosostros esque hemos perdido
          if(snapshot.data().winner!=this.player){
            console.log("has perdido bro");

            this.fs.deleteGame(this.game);

            this.openLoser();
          }
        }
        else{//Eventos de tipo mensaje

          if(this.player=="0"){

            msg=snapshot.data().chat1;
            foe="1";
          }else{

            msg=snapshot.data().chat0;
            foe="0";
          }

          if(msg!=undefined && msg!=""){
            this.chat.push([foe, msg]);
          }
        }

      }
      else{
        this.sent=false;
        this.first_connection=false;
      }

    })
  }

  /*
  * Recibe:
  *   msg:string mensaje a mandar
  * Asume:
  *   player esta inicializado
  * Añade a la bbdd un mensaje en el documento correspondiente a esta partida
  * y en el chat de este jugador
  */
  private sendMsg(msg:string){

    this.fs.getGame(this.game.idGame).then(game=>{

      if(this.player=="0"){
       game.chat0=msg;
      }else{
        game.chat1=msg;
      }
  
      this.fs.updateGame(game);
  
      //TODO: apendear el mensaje como local
    })

    this.chat.push( [this.player, msg] )


    
  }

  //Devuelve la url del personaje del oponente
  // private async getOponent(url:string): Promise<boolean>{
  //   console.log("this game:",this.game);

  //   await 

  //     this.game=game;

  //     console.log("game cogido:", game)

  //     if(this.player=="0"){
  //       console.log("character_creator:",this.game.character_creator);

  //       return this.game.character_creator==url;
  //     }
  //     else{
  //       console.log("character_joined:",this.game.character_joined==url);

  //       return this.game.character_joined==url;
  //     }

  //   })

  // }


  //----------------------------Interaccion con el tablero:--------------------------------

  /*
  Se ejecuta al hacer click sobre un personaje o una X.
  Recibe como argumentos la fila y la columna del mismo.
  Tacha o destacha a un personaje.
  Si se está enviando un resultado comprueba si el personaje es el objetivo,
    e indica al usuario si ha ganado o perdido. Tras esto acaba la partida.
  */
  public onClickNpc(i:number, j:number){
    if(!this.selecting){//Si no estamos enviando un personaje cambiamos el estado del clicado
      if(this.matrix[i][j].state==0){
        this.matrix[i][j].state=1;
      }
      else{
        this.matrix[i][j].state=0;
      }
    }
    else{ //Si estamos seleccionando el personaje para resolver comprobamos si es el correcto
      this.fs.getGame(this.game.idGame).then(game=>{
      
        if(this.player=="0"){

          if(this.matrix[i][j].url==game.character_creator){
            this.openWinner();
          }
          else{
            this.openTryAgain();
          }
        }
        else{

          if(this.matrix[i][j].url==game.character_joined){
            this.openWinner();
          }
          else{
            this.openTryAgain();
          }

        }
        
      });

    } 
  }

  //Cambia el estado de selecting
  public toggleSelecting(){
    this.selecting=!this.selecting;
  }


  //Coge el mensaje del formulario y lo envia
  public getMsg(event:any){
    //Cargamos el mensaje del formulario
    const msg=event.target.firstChild.value;
    //Enviamos el mensaje
    this.sent=true;
    this.sendMsg(msg);

    event.target.firstChild.value = "";

  }


  //----------------------------Funciones del juego----------------------------

  //Función para abrir el popup de cuando el usuario ha adivinado el personaje y gana la partida
  public openWinner(){
    const dialogRef = this.dialogW.open(winnerDialog, {
      width: '30%'
    });
    // Llamamos a la función
    dialogRef.afterClosed().subscribe(result=>{
      this.increasePoints(result);
      this.end(true);
    });
  }

  //Función para abrir el popup de cuando el usuario no ha adivinado el personaje
  public openTryAgain(){
    const dialogRef = this.dialogT.open(tryAgainDialog, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe(result=>{
      this.reducePoints(result);
    });
  }

  //Función para abrir el popup de cuando el usuario ha perdido la partida
  public openLoser(){
    const dialogRef = this.dialogL.open(loserDialog, {
      width: '30%'
    });
    dialogRef.afterClosed().subscribe(result=>{
      this.reducePoints(result);
      this.end(false);
    });
  }


  //Función para restar puntos al usuario
  public reducePoints(points:number){

    console.log("puntos antes ", this.global.actualUser.points);

    let actualPoints = this.global.actualUser.points;

    if (actualPoints > points) {
      this.global.actualUser.points = actualPoints - points;
      console.log("puntos despues de restar ", this.global.actualUser.points);
    }
    else{
      this.global.actualUser.points = 0;
      console.log("puntos despues de restar teniendo menos de 10 puntos ", this.global.actualUser.points);
    }

    this.fs.updateUser(this.global.actualUser);
  }


  //Función para sumar puntos al usuario
  public increasePoints(points:number){

    console.log("puntos antes ", this.global.actualUser.points);
    console.log("nivel antes ", this.global.actualUser.level);


    let actualPoints = this.global.actualUser.points;
    let actualLevel = this.global.actualUser.level;

    let maxPointsLevel = actualLevel * 100;

    if (actualPoints + points < maxPointsLevel) {
      this.global.actualUser.points = actualPoints + points;
    }
    else{
      actualPoints += points;
      while (actualPoints >= maxPointsLevel) {
        actualLevel += 1;
        actualPoints -= maxPointsLevel;
        maxPointsLevel = actualLevel * 100;
      }
      this.global.actualUser.points = actualPoints;
      this.global.actualUser.level = actualLevel;
    }

    this.fs.updateUser(this.global.actualUser);
  }




   //Funcion a ejecutar cuando acaba la partida
  private end(win:boolean){
    if(win){
      this.game.winner=this.player;
      this.fs.updateGame(this.game);

    }
    this.sent=true;

    //Eliminamos las cookies de la partida
    this.cookieService.delete("player");
    this.cookieService.delete("cookieGame");

    //Devolvemos al usuario a la pagina principal
    this.cookieService.set("page", '/principalpage', cookie_time);
    this.cookieService.set("uid", this.cookieService.get("uid"), cookie_time);


    this.router.navigate(['/principalpage']);
  }

  //Función que muestra mensaje cuando pulsas en el botón de 'RESOLVER'
  public openSnackBar() {
    this.snackBar.open("Selecciona el personaje misterioso que crees que tiene tu rival", "", {
      duration: 8000,
    });
  }

 //Función que muestra mensaje cuando pulsas en el botón de 'CANCELAR'
  public openSnackBar2() {
    this.snackBar.open("Has salido del modo resolver", "", {
      duration: 4000,
    });
  }








}//End game class


//WINNER------------------------------------------------------------------------

//Componente auxiliar para winner
@Component({
  selector: 'app-game-winner',
  templateUrl: './game.component.winner.html',
  styleUrls: ['./game.component.winner.scss']
})

//Clase del popup del winner
export class winnerDialog implements OnInit{

  //Constructor
  constructor(public dialogRef: MatDialogRef<winnerDialog>, private router: Router, private route: ActivatedRoute, private fs: FirestoreService, public global: GlobalService){}


  ngOnInit(){}

  onNoClick(): void {
    this.dialogRef.close(50);
  }

  public end(){
    this.router.navigate(['/principalpage']);
  }

}



//TRY AGAIN---------------------------------------------------------------------

//Componente auxiliar para tryAgain
@Component({
  selector: 'app-game-tryAgain',
  templateUrl: './game.component.tryAgain.html',
  styleUrls: ['./game.component.tryAgain.scss']
})

//Clase del popup del winner
export class tryAgainDialog implements OnInit{

  //Constructor
  constructor(public dialogRef: MatDialogRef<tryAgainDialog>, private router: Router, private route: ActivatedRoute, private fs: FirestoreService, public global: GlobalService){}


  ngOnInit(){}


  onNoClick(): void {
    this.dialogRef.close(10);
  }

}

//LOSER-------------------------------------------------------------------------

//Componente auxiliar para loser
@Component({
  selector: 'app-game-loser',
  templateUrl: './game.component.loser.html',
  styleUrls: ['./game.component.loser.scss']
})

//Clase del popup del loser
export class loserDialog implements OnInit{

  //Constructor
  constructor(public dialogRef: MatDialogRef<loserDialog>, private router: Router, private route: ActivatedRoute){}


  ngOnInit(){}

  onNoClick(): void {
    this.dialogRef.close(25);
  }

  public end(){
    this.router.navigate(['/principalpage']);
  }


}
