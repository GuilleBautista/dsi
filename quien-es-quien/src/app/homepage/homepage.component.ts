import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { FirestoreService } from '../services/firestore/firestore.service';
import { SesionData } from '../clases/sesiondata';
import { cookie_time } from '../global';

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

  constructor(public dialog: MatDialog, private cookieService: CookieService, private fs: FirestoreService) {
    
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

      this.fs.getSesionCookie(sesionid).then(data=>{
        //comprobamos si la sesion existe
        if(data.exists){
          //Si la sesion existe la cargamos
          this.loadSesionData(data);
        }
        else{
          //Si la sesion no existe la creamos

          let sesion_data=new SesionData({
            id:sesionid,   //Asumimos que el id de sesion esta bien
            uid:"",        //En la pagina principal no puede haber iniciado sesion
            game:""        //En la pagina principal no puede haber iniciado una partida
          })
            
          this.fs.createSesion(sesion_data);
          //catch error: sesion duplicada => createSesion()
        }

      }); //GetSesionCookie


    }else{
      //Si no la tenemos

      this.generateSesion();

      this.cookieService.set("SesionId", "3", 1/24);
    }

  }

  private loadSesionData(sesion:any){
    //TODO: cargar los datos de sesion
    let data=sesion.data();

    this.cookieService.set("SesionId", data.id, cookie_time);

    if(data.uid!=""){
      //login
    }
    if (data.game!=""){
      //cargar partida
    }



  }

  private generateSesion(){
    //TODO: generar ids de sesion
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
