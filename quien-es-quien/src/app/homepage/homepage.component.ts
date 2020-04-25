import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { FirestoreService } from '../services/firestore/firestore.service'
import { Subscription } from 'rxjs';


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

  constructor(public dialog: MatDialog) {}

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

//Componente auxiliar para login
@Component({
  selector: 'app-homepage-login',
  templateUrl: './homepage.component.login.html',
  styleUrls: ['./homepage.component.login.scss']
})

//Clase del popup del login
export class loginDialog {
  hide = true;   //Para que la contraseña no se vea

  constructor(
    public dialogRef: MatDialogRef<loginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}





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



  //Usuario
  public user: User;

  public s_users: Subscription;

  public users: User[];


  //Constructor
  constructor(public dialogRef: MatDialogRef<registerDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private firestoreService: FirestoreService,
              private router: Router, private route: ActivatedRoute)
  {
      this.user=new User();
      this.users=[];
  }

  ngOnInit(){
      this.s_users = this.firestoreService.getUsers().subscribe(data=>{
        this.users = data;
      });
    }

    ngOnDestroy(){registerDialog
      this.s_users.unsubscribe();
    }



  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.users);

  }

  public finish()
{

  //if(this.user.name )


  this.user.name = this.data.name;
  this.user.password = this.data.password;
  // if(this.contacto.id!=undefined)
  //   this.firestoreService.updateContacto(this.contacto);
  // else
  this.firestoreService.createUser(this.user);
  this.onNoClick();
  //this.router.navigate(['list/']);
}



}
