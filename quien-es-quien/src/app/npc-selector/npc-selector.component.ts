import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-npc-selector',
  templateUrl: './npc-selector.component.html',
  styleUrls: ['./npc-selector.component.scss']
})
export class NpcSelectorComponent implements OnInit {

  //Matriz para el tablero
  public matrix:Array<Array<any>>;
  public set:number=0;
  public x_picture:string="";

  constructor(private fs: FirestoreService, public router: Router, public route: ActivatedRoute) {
    //Comprobamos si se han pasado los datos por la url
    if(history.state.data == undefined){
      //Si no recibimos datos vamos a la pagina principal
      this.router.navigate(['/principalpage']);
    }
    else{
      //Cogemos el set de la url
      this.set=history.state.data.set;
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

    //Guardamos la url de la X para tachar los personajes
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

  /*
  Devuelve por la url:
    data: estructura de datos que contiene=>
    {
      npc:string contiene la url de la imagen del personaje elegido, 
      set:number contiene el set elegido anteriormente
    }
  Recibe:
    url:string contiene la url de la imagen del personaje elegido. Viene del propio html.
  
  Descripción:
    Funcion para seleccionar el npc con el que se creará la pagina de juego.
    Esta función redirecciona automáticamente a la pagina de juego.
    Recibe como argumento la url del personaje seleccionado y 
      la reenvia a través de la URL de la pagina al componente del juego.
  */
  public select(url:string){  
    //creamos una estructura de datos para pasar por la url
    let data={
      npc: url, //npc:string contiene la url del personaje elegido, 
      set: this.set //set:number contiene el set elegido anteriormente
      }
    this.router.navigate(['/game'], 
      { 
        state: { data: data }//Pasamos los datos por la url

      }   // No se muestran en la URL
    );
  }

}
