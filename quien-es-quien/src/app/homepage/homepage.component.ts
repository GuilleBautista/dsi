//Imports basicos
import { Component, OnInit, Inject, HostListener, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

//Tipos de datos
import { User } from '../clases/user';
import { cookie_time } from '../global';
import { Subscription } from 'rxjs';

//Servicios
import { GlobalService } from '../services/global/global.service';
import { FirestoreService } from '../services/firestore/firestore.service'
import { CookieService } from 'ngx-cookie-service';



//Interfaz del dialog
export interface DialogData {
  username: string;
  password: string;
  name: string;
}

//Componente de la Homepage
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})

//Clase del HomepageComponent
export class HomepageComponent implements OnInit {

  username: string;
  password: string;
  name: string;

  constructor(public dialog: MatDialog, private cookieService: CookieService, private fs: FirestoreService, private global:GlobalService,
    public router: Router, public route: ActivatedRoute) {

  }

  //Función para abrir el popup de login
  openLogin(): void {
    const dialogRef = this.dialog.open(loginDialog, {
      width: '20%',
      data: {password: this.password, username: this.username}
    });
  }

  //Función para abrir el popup de register
  openRegister(): void {
    const dialogRef = this.dialog.open(registerDialog, {
      width: '22%',
      data: {password: this.password, username: this.username, name: this.name}
    });
  }


  ngOnInit(): void {
    let uid=this.cookieService.get("uid");
    let game=this.cookieService.get("gameid");
    let page=this.cookieService.get("page");

    this.loadSesion(uid, game, page);

  }

  /*
  * Recibe:
      uid: string que se corresponde con el id de un usuario de la bbdd
      game: string que se corresponde con el id de una partida en la bbdd
      page: string que se corresponde con la ultima pagina visitada por el usuario
  * Funcion generica de carga de sesiones, para ponerla en cada pagina
  * La funcion carga al usuario si existe y no está cargado, y lo mismo con la partida.
  * Si no esta en una partida se navega a la ultima pagina cargada por el usuario
  */
  private loadSesion(uid:string, game:string, page:string){

    if(uid!=""){
      //Primero iniciamos sesion
      this.fs.getUser(uid).then(user=>{
        this.global.actualUser=user;
        //Si habia una sesion vamos a la pagina principal
        this.cookieService.set("page", "/principalpage", cookie_time);
        this.router.navigate(["/principalpage"]);

      }).catch(error=>{
        console.log("Error iniciando sesion", error);
        //Si hay un error eliminamos las cookies y recargamos la pagina
        this.cookieService.deleteAll();
        this.cookieService.set("page", "/", cookie_time);
        this.router.navigate(["/"]);
      })

    }else{
      //Si no habia una sesion eliminamos las cookies y esperamos
      this.cookieService.deleteAll();
    }

    //Luego comprobamos si estaba en una partida
    if(game!=""){
      //TODO: cargar partida
    }else{
      //Si no estaba en partida no pasa nada
    }

    //Si no estaba en una partida le llevamos a la pagina en la que lo dejo
    if(page!=""){
      //Si estaba en una pagina le llevamos a esa pagina,
      //  a no ser que sea la actual
      if(this.router.url!=page){
        this.cookieService.set("page", page, cookie_time);
        this.router.navigate([page]);
      }
    }else if(uid!=""){
      //Si no estaba en ninguna pagina y habia iniciado sesion se le lleva a la principal
            //Esto no deberia de pasar nunca
      //Antes de ir a cualquier pagina cambiamos la cookie
      this.cookieService.set("page", "/principalpage", cookie_time);
      this.router.navigate(['/principalpage']);
    }
    else{
      //Si no tenia pagina la pagina será esta
      this.cookieService.set("page", "/", cookie_time);
    }

  }

}//End homepage class






//INICIO DE SESIÓN--------------------------------------------------------------

//Componente auxiliar para login
@Component({
  selector: 'app-homepage-login',
  templateUrl: './homepage.component.login.html',
  styleUrls: ['./homepage.component.login.scss']
})

//Clase del popup del login
export class loginDialog implements OnInit{
  hide = true;   //Para que la contraseña no se vea


  //Variable pública para poder sacar el mensaje de error si no éxiste un usuario con el mismo nombre y contraseña en la BD
  public userR : boolean;

  //Usuario, lista usuarios, suscripciones usuarios
//  public user: User;
  public users: User[];
  public sUsers: Subscription;



  //Constructor
  constructor(public dialogRef: MatDialogRef<loginDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private firestoreService: FirestoreService,
              private router: Router, private route: ActivatedRoute, public global: GlobalService, private cookieService: CookieService)
  {
      //this.user=new User();
      this.users=[];

  }

  ngOnInit(){
      this.sUsers = this.firestoreService.getUsers().subscribe(data=>{
        this.users = data;
      });
    }

  ngOnDestroy(){loginDialog
      this.sUsers.unsubscribe();
    }


  onNoClick(): void {
    this.dialogRef.close();
  }


  //Función para que un usuario registrado inicie sesión
  public login(){
    this.userR = false;
  //Comprobamos que hay un usuario con el mismo nombre y contraseña en la BD
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].username == this.data.username && this.users[i].password == this.data.password) {
        console.log('el usuario existe');
        this.userR = true;

        //TODO: posiblemente se pueda hacer de otra forma
        //Guardamos al usuario actual en la cookie
        this.cookieService.set("uid", this.users[i].id, cookie_time);

        //Iniciar sesion consiste en dar valor a esta variable
        this.global.actualUser = new User(this.users[i].name, this.users[i].username, this.users[i].password,
          this.users[i].level, this.users[i].points, this.users[i].id, this.users[i].profilePhotoURL);
      }
    }


    if (this.userR) {
      this.onNoClick();

      //Antes de navegar a una pagina ponemos valor a la cookie
      this.cookieService.set("page", "/principalpage", cookie_time);

      this.router.navigate(["/principalpage"]);

    }
    else{
      console.log('prueba otra vez');
    }
  }


}



//REGISTRO----------------------------------------------------------------------

//Componente auxiliar para register
@Component({
  selector: 'app-homepage-register',
  templateUrl: './homepage.component.register.html',
  styleUrls: ['./homepage.component.register.scss']
})

//Clase del popup del register
export class registerDialog implements OnInit {
  hide = true;   //Para que la contraseña no se vea

  public passwordR : string; //Variable pública para el input de repetir contraseña

  //Variable pública para poder sacar el mensaje de error si ya éxiste un usuario con el mismo nombre en la BD
  public eUser : boolean;


  //Usuario, lista usuarios, suscripciones usuarios
  public user: User;
  public users: User[];
  public sUsers: Subscription;



  //Constructor
  constructor(public dialogRef: MatDialogRef<registerDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private firestoreService: FirestoreService,
              private router: Router, private route: ActivatedRoute, public global: GlobalService,  private cookieService: CookieService)
  {
      this.user=new User("", "", "", 0, 0, "","");
      this.users=[];
  }

  ngOnInit(){
      this.sUsers = this.firestoreService.getUsers().subscribe(data=>{
        this.users = data;
      });
    }

  ngOnDestroy(){registerDialog
      this.sUsers.unsubscribe();
    }


  onNoClick(): void {
    this.dialogRef.close();
  }


  //Función para registrar un nuevo usuario en la base de datos
  public finish(){
    this.eUser = false;
  //Comprobamos que no hay un usuario con el mismo nombre de usuario en la BD
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].username == this.data.username) {
        console.log('usuario repetido')
        this.eUser = true;
      }
    }

    if (this.eUser) {
      console.log('elije otro nombre, ese ya existe');
    }
    else{
      this.user.name = this.data.name;
      this.user.username = this.data.username;
      this.user.password = this.data.password;
      this.user.level = 1;
      this.user.points = 0;

      console.log(this.user);


      this.firestoreService.createUser(this.user);
      this.global.actualUser = this.user;

      this.onNoClick();

      //Antes de ir a una pagina cambiamos la cookie de la pagina
      this.cookieService.set("page", "/profile", cookie_time);
      this.router.navigate(["/profile"]);


    }

  }

}
