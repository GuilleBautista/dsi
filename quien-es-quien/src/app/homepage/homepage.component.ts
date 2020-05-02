//Imports basicos
import { Component, OnInit, Inject, HostListener, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

//Tipos de datos
import { User } from '../user';
import { SesionData } from '../clases/sesiondata';
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
    let sesionid=this.cookieService.get("SesionId");
    
    if(sesionid!=""){
      //Si tenemos la cookie de sesion comprobamos si existe
      console.log("tenemos cookie de sesion:", sesionid);

      this.fs.getSesionCookie(sesionid).then(data=>{
        //comprobamos si la sesion existe
        if(data.exists){
          //Si la sesion existe la cargamos
          console.log("cargando datos de sesion")
          this.loadSesionData(data);
        }
        else{
          //Si la sesion de la cookie no existe la creamos
          //Esto significa que el usuario ha cargado la pagina de inicio o la de login pero no ha hecho nada y su sesion ha expirado

          console.log("la sesion no existe en la bbdd, creando sesion");

          let sesion_data=new SesionData({
            id:sesionid,   //Asumimos que el id de sesion esta bien
            uid:"",        //En la pagina principal no puede haber iniciado sesion
            game:"",       //En la pagina principal no puede haber iniciado una partida
            cre_date:Date.now() //La fecha siempre es la actual
          })
            
          this.fs.createSesion(sesion_data);
          //catch error: sesion duplicada => createSesion()
        }

      });

    
    }else{
      console.log("creando cookie de sesion");
      //Si no la tenemos creamos una sesion
      let sesionid=this.fs.createSesion();
      //Creamos la cookie de la sesion
      this.cookieService.set("SesionId", sesionid, cookie_time);
    }

  }

  /*
  Recibe una sesion en crudo de firebase y la carga
  El proceso de carga de sesion es iniciar sesion si existe un usuario
    y reanudar una partida si existe una
  */
  private loadSesionData(sesion:any){
    //Cargamos los datos de sesion
    let data=sesion.data();
    //La sesion actual se reinicia
    this.cookieService.set("SesionId", data.id, cookie_time);
    
    //Si el usuario habia iniciado sesion se vuelve a logear
    if(data.uid!=""){
      //el usuario actual será el almacenado en la sesion
      this.fs.getUser(data.uid).then(user=>{
        this.global.actualUser=user;
        //redirigimos al usuario a la pagina principal provisionalmente
        this.router.navigate(['/principalpage']);
      })

    }
    
    //Si el usuario estaba en una partida se carga
    if (data.game!=""){
      //TODO: cargar partida
    }

  }


}





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
              private router: Router, private route: ActivatedRoute, public global: GlobalService)
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

        //Iniciar sesion consiste en dar valor a esta variable
        //TODO: posiblemente se pueda hacer de otra forma
        this.global.actualUser = new User(this.users[i].name, this.users[i].username, this.users[i].password, 
          this.users[i].level, this.users[i].points, this.users[i].id);
      }
    }


    if (this.userR) {
      this.onNoClick();
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
              private router: Router, private route: ActivatedRoute, public global: GlobalService)
  {
      this.user=new User("", "", "", 0, 0, "");
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

      this.firestoreService.createUser(this.user);
      this.global.actualUser = this.user;
      this.onNoClick();
      this.router.navigate(["/profile"]);

      // this.firestoreService.getImg("profilePhotos/user.svg").subscribe(url=>{
      //   this.global.actualPhoto=url;
      //   console.log(this.global.actualPhoto);
      //
      // });
    }

  }

}
