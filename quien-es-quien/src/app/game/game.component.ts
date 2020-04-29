import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';
import {debugging as debug} from '../global'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  //Matriz para el tablero
  public matrix:Array<Array<any>>;
  public set:Number=0;
  public playerNpc:string;
  public x_picture:string;
  public goal:string;
  
  public selecting:boolean=false;

  public debug:boolean=debug;
  public default:boolean=false;  
  //El objetivo por defecto es yasmin. TODO: conseguir el objetivo de una forma mejor

  constructor(private fs: FirestoreService, public router: Router, public route: ActivatedRoute) {
    //Comprobamos si se han pasado los parámetros por la url.
    if(history.state.data == undefined ){
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
      this.set=history.state.data.set;//Cogemos el set de la url
      this.playerNpc=history.state.data.npc;//Cogemos el personaje de la url
    }
    
    //Inicializamos una matriz de personajes
    this.matrix=[];
    for(let i=0; i<4; i++){
      this.matrix.push([]);
      for(let j=0; j<6; j++){

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
    

   }

  ngOnInit(): void {
    
    //If default flag is true we initialize the matrix with random player and goal
    if(this.default ){
      this.initializeMatrix(
        this.selectRandomNpc(),
        this.selectRandomNpc()
      )
    }else{
      this.initializeMatrix();
    }
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
    let i= Math.floor(Math.random()*4);
    let j= Math.floor(Math.random()*6);
    
    let result={
      i:i,
      j:j
    }

    return result;
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

  //Cambia el estado de selecting, convendría cambiar también el html
  public toggleSelecting(){
    this.selecting=!this.selecting;
  }

  //Funciones del juego

  //Funcion a ejecutar cuando acaba la partida
  private end(){
    //TODO: Hacer algo mas al acabar el juego
    this.router.navigate(['/principalpage']);
  }

}
