import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { firestore } from 'firebase';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  //Matriz para el tablero
  public matrix:Array<Array<any>>;
  public set:Number=0;

  constructor(private fs: FirestoreService) {
    if(history.state.param_not_in_url != undefined){
      this.set=history.state.param_not_in_url;
    }
    
    //Inicializamos una matriz de personajes
    this.matrix=[];
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

   }

  ngOnInit(): void {

    this.initializeMatrix();
        
  }

  /*
  Funcion para dar valor a las imagenes de los personajes de la matriz.
  Esta funcion asume que los unicos elementos que hay en la carpeta del set a acceder son las imagenes del set en cuestion.
  */
  private initializeMatrix(){
    //Cogemos las imagenes de la base de datos
    let i=0, j=0;

    //Accedemos a la carpeta del set correspondiente
    this.fs.getImages("/characters/set"+this.set).subscribe(
      result=>{
        //Cogemos todos los elementos de dentro
        for(let pic of result.items){ //items para archivos, prefixes para carpetas
          pic.getDownloadURL().then(url=>{
            //Asignamos a cada elemento de la matriz la url de uno de estos elementos
            this.matrix[i][j].url=url;
            i+=1;
            if(i>=4){ i=0; j+=1; }
          });
        }
      })
  }

}
