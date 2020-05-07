import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../clases/user';
import { cookie_time } from '../global';


import { GlobalService } from '../services/global/global.service';
import { CookieService } from 'ngx-cookie-service';
import { FirestoreService } from '../services/firestore/firestore.service';
import { AngularFireStorage } from '@angular/fire/storage';


//Interfaz del dialog
export interface DialogData {
  username: string;
  name: string;
  password: string;
  level:number;
  points:number;

  newName:string;
  newUsername:string;
  newPassword:string;
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public name:string;
  public username:string;
  public level:number;
  public points:number;

  public profilePic:string;

  public user: User;


  constructor(private fs: FirestoreService, private router: Router, private route: ActivatedRoute,
    public global: GlobalService, public dialog: MatDialog, private cookieService: CookieService) {

      this.loadSesion(
        this.cookieService.get("uid"),
        this.cookieService.get("game")
      );

  }

  ngOnInit(): void {

  }

  //Función para abrir el popup de edit
  public edit(): void{
    const dialogRef = this.dialog.open(editDialog, {
      width: '45%',
      data: {name: this.name, username: this.username, level: this.level, points: this.points, profilePic: this.profilePic}
    }).afterClosed().subscribe(x=>{
        //Al cerrar actualizamos el usuario
        this.user=this.global.actualUser;
    });

    //actualizamos el usuario despues de editar


  }

  /*
  * Recibe:
  *   -uid: string que se corresponde con el id de un usuario de la bbdd
  *   -game: string que se corresponde con el id de una partida en la bbdd
  * En este caso no recibimos la pagina, ya que si ha iniciado sesion se deja que navegue con la barra
  * de navegacion, y si no se redirige automaticamente a la pagina de inicio.
  *
  * Funcion generica de carga de sesiones, para ponerla en cada pagina
  * En este caso, la funcion hace de constructor, dando valor al usuario y a la foto de perfil
  *   una vez que se ha iniciado sesion con la cookie.
  *   Esto es para que se puedan recargar las paginas y no haya perdida de informacion.
  *
  * La funcion carga al usuario si existe y no está cargado, y lo mismo con la partida.
  * En este caso, si no hay usuario se devuelve a la pagina de inicio para que se inicie sesion.
  *
  * Si no esta en una partida se navega a la ultima pagina cargada por el usuario
  */
 private loadSesion(uid:string, game:string){

  if(uid!=""){

    //Primero iniciamos sesion
    this.fs.getUser(uid).then(user=>{
      this.global.actualUser=user as User;

      //Renovamos la cookie de sesion
      this.cookieService.set("uid", uid, cookie_time);

      //Tras iniciar sesion damos valor a las variables del componente
      this.user=this.global.actualUser;

      if(this.user.profilePhotoURL==""){
        //Cargamos la foto de perfil por defecto del usuario
        this.fs.getImg("profilePhotos/user.svg").subscribe(url=>{
          this.global.actualUser.profilePhotoURL=url;
          this.user.profilePhotoURL=url;

          //Actualizamos la bbdd
          this.fs.updateUser(this.user);

        });

      }

    }).catch(error=>{
      console.log("Error iniciando sesion:",error);
      //Si hay un error eliminamos las cookies y vamos a la pagina de inicio
      this.cookieService.deleteAll();
      this.cookieService.set("page", "/", cookie_time);
      this.router.navigate(["/"]);
    })

  }else{
    alert("la sesion ha caducado, inicia sesion de nuevo para continuar")
    //Si no habia una sesion eliminamos las cookies
    this.cookieService.deleteAll();

    //Despues redirigimos a la pagina de inicio
    this.cookieService.set("page", "/", cookie_time);
    this.router.navigate(['/']);
  }

  //Es necesario cargar la partida estemos en la pagina que estemos
  //  para evitar que se dejen las partidas a medias
  if(game!=""){
    //TODO: cargar partida
  }

}

public logOut(){
  this.cookieService.deleteAll();
  this.cookieService.set("page", "/", cookie_time);
  this.router.navigate(["/"]);
}


}

  //--------------------------POPUP PARA EDITAR--------------------------

  //Componente auxiliar para editar
  @Component({
    selector: 'app-profile-edit',
    templateUrl: './profile.component.edit.html',
    styleUrls: ['./profile.component.edit.scss']
  })

  //Clase del popup del edit
  export class editDialog implements OnInit {

    //Variable pública para poder sacar el mensaje de error si ya éxiste un usuario con el mismo nombre en la BD
    public alreadyUser : boolean;

    public name: string;
    public newName: string = '';

    public username: string;
    public newUsername: string = '';

    public password: string;
    public newPassword: string = '';

    public selectedFile: File;

    public user: User;
    public users: User[];
    public sUsers: Subscription;

    public profilePic: string;


    //Constructor
    constructor(public dialogRef: MatDialogRef<editDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public global: GlobalService, private fs: FirestoreService, public storageRef:AngularFireStorage) {

      this.name = this.global.actualUser.name;
      this.username = this.global.actualUser.username;
      this.password = this.global.actualUser.password;

      this.user=this.global.actualUser;

    }

    ngOnInit() {
      this.sUsers = this.fs.getUsers().subscribe(data=>{
        this.users = data;
      });
    }

    ngOnDestroy(){editDialog
        this.sUsers.unsubscribe();
      }

    onNoClick(): void {
      this.dialogRef.close();
    }


    onFileChanged(event) {
      this.selectedFile = event.target.files[0]
    }


    //Función para guardar cambios del perfil
    public async save(){
      this.alreadyUser = false;
      //si ha introducido un nombre lo cambiamos
      if (this.data.newName != undefined && this.data.newName != ""){
        this.user.name = this.data.newName;
      }
      //si ha introducido un nombre de usuario lo cambiamos
      if(this.data.newUsername != undefined && this.data.newUsername != ""){
        //TODO: hacer esto con una where
        //Comprobamos que no hay un usuario con el mismo nombre de usuario en la BD
        for (let i = 0; i < this.users.length; i++) {
          if(this.users[i].username == this.data.newUsername){
            this.alreadyUser = true;
          }
        }
        //Si el nombre de usuario no esta repetido lo asignamos
        if(!this.alreadyUser){
          this.user.username=this.data.newUsername;
        }
      }
      //Si ha introducido una contraseña la cambiamos
      if(this.data.newPassword != undefined && this.data.newPassword != ""){
        this.user.password = this.data.newPassword;
      }

      if(this.alreadyUser){
        //Si hay un error lo notificamos
        //TODO: notificar en el popup
        console.log('ERROR: nombre de usuario repetido');
      }
      else{
        //Si el usuario no esta repetido lo actualizamos
        await this.fs.updateUser(this.user);
        //Cerramos el popup
        this.onNoClick();
      }


      //Subir la foto de perfil
      if (this.selectedFile != undefined) {
        let profilePhotoRef = this.storageRef.ref('profilePhotos/' + this.global.actualUser.id);

        let file = this.selectedFile;

        //Cambiamos la foto de perfil
        await profilePhotoRef.put(file).then(x=>{
          //Nos subscribimos al cambio, ya que la foto puede tardar en subirse
          this.fs.getImg("profilePhotos/"+this.user.id).subscribe(async url=>{
            //Actualizamos la foto de la variable global
            this.global.actualUser.profilePhotoURL=url;

            await this.fs.updateUser(this.global.actualUser);

            console.log(this.global.actualUser.profilePhotoURL);

          });
        });

      }

    }

}
