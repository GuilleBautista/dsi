import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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
export class registerDialog {
  hide = true;   //Para que la contraseña no se vea

  public passwordR : string; //Variable pública para el input de repetir contraseña

  constructor(
    public dialogRef: MatDialogRef<registerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
