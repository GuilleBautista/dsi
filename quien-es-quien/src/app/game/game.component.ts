import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { firestore } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Game } from '../clases/game';
import { GlobalService } from '../services/global/global.service';


import { CookieService } from 'ngx-cookie-service';


import {MatSnackBar} from '@angular/material/snack-bar';

import { Router, ActivatedRoute } from '@angular/router';
import {debugging as debug, height, width, cookie_time} from '../global';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

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
    private snackBar: MatSnackBar, public global: GlobalService) {
    
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

    //Inicializamos el chat
    this.chat=[];

    //Guardamos el id de la partida actual en una variable temporal
    let gameid=this.cookieService.get("cookieGame")  

    if(gameid==""){ //Comprobamos si estaba en una partida
      
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
      else{//Si se han recibido datos se cargan y se crea una partida
        
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
          chat0:  [],
          chat1:  [],
          //TODO: generar las salas mejor Quiza en la nube si hay tiempo?
          room: (Math.floor(Math.random()*1000000)).toString(),
          //TODO
          idGame:"1"
        })
        //Creamos la partida en la bbdd
        this.fs.createGame(this.game);

        //Obtenemos las imagenes de la base de datos
        this.initializeMatrix();

        //Creamos una subscripcion de la partida a la bbdd
        this.watchChanges();

        this.cookieService.set("cookieGame", this.game.idGame, cookie_time);
        
      }

    } 
    else{//Si las cookies estan inicializadas se carga la partida
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

    //Cargamos el turno del jugador
    console.log("eres el jugador "+this.player)

   }


  ngOnInit() {

    


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
      console.log("snapshot data: ",snapshot.data())
     
      if(!this.sent && !this.first_connection){

        if(this.player=="0"){
          //TODO: solo coger un parametro
          msg=snapshot.data().chat1[snapshot.data().chat1.length-1];
          foe="1";
        }else{
          //TODO: no guardar la lista completa
          msg=snapshot.data().chat0[snapshot.data().chat0.length-1];
          foe="0";
        }
        
        if(msg!=undefined && msg!=""){
          console.log(msg);
          this.chat.push([foe, msg]);
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

    console.log("player: ", this.player)

    if(this.player=="0"){
      this.game.chat0.push(msg);
    }else{
      this.game.chat1.push(msg);
    }
    //TODO: actualizar solo el chat
    this.fs.updateGame(this.game);
    
    //TODO: apendear el mensaje como local
    this.chat.push( [this.player, msg] )
  }

  //Devuelve la url del personaje del oponente
  private getOponent():string{
    if(this.player=="0"){
      return this.game.character_creator;
    }
    else{
      return this.game.character_joined;
    }
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
    if(!this.selecting){//Si no estamos enviando un personaje cambiamos el estado del clicado
      if(this.matrix[i][j].state==0){
        this.matrix[i][j].state=1;
      }
      else{
        this.matrix[i][j].state=0;
      }
    }  
    else{ //Si estamos seleccionando el personaje para resolver comprobamos si es el correcto

      if(this.matrix[i][j].url==this.getOponent()){
        //Has ganado
        alert("WINNER WINNER CHICKEN DINNER !!");
        this.end();
      }
      else{
        //Has perdido
        alert("Va a ser que no, prueba otra vez");
      }
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
    

  }

 
  //----------------------------Funciones del juego----------------------------

  //Funcion a ejecutar cuando acaba la partida
  private end(){
    //TODO: Cambiar el estado de winer en la bbdd (y crear winer)
    //this.router.navigate(['/principalpage']);
  }

  //Función que muestra mensaje cuando pulsas en el botón de 'RESOLVER'
  public openSnackBar() {
    this.snackBar.open("Selecciona el personaje misterioso que crees que tiene tu rival", "", {
      duration: 8000,
  });
}








}
