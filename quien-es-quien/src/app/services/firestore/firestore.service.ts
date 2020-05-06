import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {IGameData, GameData} from '../../clases/gamedata';
import { Observable } from 'rxjs';
import { Iset,Set } from '../../clases/sets';
import { AngularFireStorage } from '@angular/fire/storage';
import { ObserversModule } from '@angular/cdk/observers';
import * as firebase from 'firebase';
import { SesionData } from 'src/app/clases/sesiondata';

import { cookie_time } from '../../global';


import { User } from '../../clases/user';
import { Game } from '../../clases/game';





@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  //FirestoreCollection
  private afsU:AngularFirestoreCollection<User>;
  private afsG:AngularFirestoreCollection<Game>;



  private game_cookies:AngularFirestoreCollection<any>;
  private sesion_cookies:AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore, public storage:AngularFireStorage) {

    this.game_cookies=this.firestore.collection('game_cookies');
    this.sesion_cookies=this.firestore.collection('sesion_cookies');



    //Colección usuarios
    this.afsU=this.firestore.collection('usuarios');

    //Colección partidas
    this.afsG=this.firestore.collection('game');
  }



//Funciones partida

public createGame(data: Game):Promise<string>{
  data.idGame='1';
  console.log("partida:", data)
  return this.afsG.doc(data.idGame).set({... data}).then(r=>{
    return data.idGame;
  });
}


public getGame(id: string):Promise<Game>{
  return this.afsG.doc(id).get().toPromise().then(r=>{
    return r.data() as Game;
  });

}

public updateGame(data:Game){
  return this.afsG.doc(data.idGame).set(Object.assign({}, data));
}

//Devuelve una lista de salas con ese id (deberia haber solo una)
public getRooms(room:string) : Observable<any>{
  return this.firestore.collection('game',ref=>ref.where("room", "==", room)).valueChanges()
}

/*
  * Delete a game
  * Called after someone wins
  */
public deleteGame(game:Game):void{
  this.afsG.doc(game.idGame).delete();
}



//Funciones usuarios

  public createUser(data: User):Promise<string>
  {
    data.id=this.firestore.createId();
    return this.afsU.doc(data.id).set({data}).then(r=>{
      return data.id;
    });
  }


  public getUser(id: string):Promise<User>
  {
    return this.afsU.doc(id).get().toPromise().then(r=>{
      return r.data() as User;
    });

  }


  public getUsers():Observable<User[]>
  {
    return this.afsU.valueChanges();
  }


  public updateUser(data:User){
    return this.afsU.doc(data.id).set(Object.assign({}, data));
  }

  public getOrderedUsers():Observable<User[]>{

    return this.firestore.collection<User>('usuarios',ref=>ref.orderBy('points', 'desc')).valueChanges();
  }


//-------------------------Game cookies-------------------------

  public getGameCookie(id:string):Promise<any>{
    return this.game_cookies.doc(id).get().toPromise();

  }

  public updateGameCookie(data:GameData){
    this.game_cookies.doc(data.id).set(Object.assign({}, data));
  }


//-------------------------Sesion Cookies-------------------------

  //Para comprobar si una cookie de sesion existe
  public getSesionCookie(sesionck:string):Promise<any>{
    return this.sesion_cookies.doc(sesionck).get().toPromise();
  }

  /*
  Recibe:
    sesion_data:SesionData En caso de recibirlo contendrá los datos con los que crear la sesion
                id, uid y game
  Devuelve:
    id:string String que identificará a la sesion tanto en la bbdd como en el codigo

  Crea una sesion con los valores correspondientes
  Si no recibe datos crea una con valores por defecto
  Al crear una sesion nueva se borraran las antiguas de la base de datos
  */
  public createSesion(sesion_data?:SesionData):string{

    //1: eliminamos las sesiones anteriores al tiempo de sesion

    //cookie_time esta en dias por lo que aplicamos un factor de conversion a ms
    let expiring_time=Date.now()-cookie_time*24*3600*1000;

    //Eliminamos las entradas con fecha de creacion anterior a expiring_time
    this.firestore.collection<SesionData>('sesion_cookies',ref=>ref
    .where('cre_date', '<', expiring_time)).valueChanges().subscribe(result=>{
      for(let sesion of result){
        //Las eliminamos una a una
        //this.deleteSesion(sesion.id);
      }
    });

    //2: creamos la sesion y la subimos

    //Si hemos recibido datos los usamos
    if (sesion_data!=undefined){
      var id=sesion_data.id;
      //Creamos la sesion con los datos recibidos
      this.sesion_cookies.doc(sesion_data.id).set(Object.assign({}, sesion_data));

    }
    else{
      //Generamos un id a traves de firebase
      var id=this.firestore.createId();
      //Creamos una nueva sesion por defecto con ese id
      this.sesion_cookies.doc(id).set(Object.assign({}, new SesionData({
        uid:"",
        game:"",
        id:id,
        cre_date:Date.now()
      })));

    }
    //Devolvemos el id de la sesion creada
    return id;

  }

  

//-------------------------Storage Functions-------------------------

  public getStorage(){
    return this.storage;
  }

  public getImg(img:string):Observable<string>{
    let ref = this.storage.ref(img);

    return ref.getDownloadURL();

  }

  public getFiles(path:string){

    let ref=this.storage.ref(path);

    return ref.listAll();
  }


}
