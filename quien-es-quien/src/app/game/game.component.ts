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
  public x_picture:string="";

  constructor(private fs: FirestoreService) {
    if(history.state.param_not_in_url != undefined){
      this.set=history.state.param_not_in_url;
    }
    this.matrix=[];

    //this.npc_list=fs.getFiles('characters/set0');
    console.log(this.npc_list)

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

}
