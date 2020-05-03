import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { FirestoreService } from '../services/firestore/firestore.service'
import { Subscription } from 'rxjs';

import { GlobalService } from '../services/global/global.service';

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
  styleUrls: ['./homepage.component.scss']
})

//Clase del HomepageComponent
export class HomepageComponent implements OnInit {

  username: string;
  password: string;
  name: string;


  constructor(public dialog: MatDialog, private cookieService: CookieService) {}

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
  public start(){
    this.userR = false;
  //Comprobamos que hay un usuario con el mismo nombre y contraseña en la BD
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].username == this.data.username && this.users[i].password == this.data.password) {
        console.log('usuario encontrado');
        this.userR = true;

        this.global.actualUser = new User(this.users[i].name, this.users[i].username, this.users[i].password, this.users[i].level, this.users[i].points, this.users[i].id, this.users[i].profilePhotoURL);
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
        console.log('usuario repe')
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


    }

  }

}
