import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FirestoreService } from '../services/firestore/firestore.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { Subscription } from 'rxjs';

import { GlobalService } from '../services/global/global.service';

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



  constructor(private fs: FirestoreService, private router: Router, private route: ActivatedRoute, public global: GlobalService, public dialog: MatDialog) {
    this.name = this.global.actualUser.name;
    this.username = this.global.actualUser.username;
    this.level = this.global.actualUser.level;
    this.points = this.global.actualUser.points;
  }

  ngOnInit(): void {
  }

  //Función para abrir el popup de edit
  public edit(): void{
    const dialogRef = this.dialog.open(editDialog, {
      width: '45%',
      data: {name: this.name, username: this.username, level: this.level, points: this.points}
    });
  }


}

  //EDITAR----------------------------------------------------------------------

  //Componente auxiliar para edit
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


    //Constructor
    constructor(public dialogRef: MatDialogRef<editDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public global: GlobalService, private fs: FirestoreService, public storageRef:AngularFireStorage) {

      this.name = this.global.actualUser.name;
      this.username = this.global.actualUser.username;
      this.password = this.global.actualUser.password;

      this.user=new User(this.global.actualUser.name, this.global.actualUser.username, this.global.actualUser.password, this.global.actualUser.level, this.global.actualUser.points, this.global.actualUser.id);
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



    public uploadPhoto(){
      console.log(this.selectedFile);
      let profilePhotoRef = this.storageRef.ref('profilePhotos/' + this.global.actualUser.id);

      let file = this.selectedFile;
      profilePhotoRef.put(file).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
      });

    }



    public save(){
      this.alreadyUser = false;
      if (this.data.newName == undefined || this.data.newName == ""){
        this.user.name = this.global.actualUser.name;
      }
      else{
        this.user.name = this.data.newName;
      }

      if(this.data.newUsername == undefined || this.data.newUsername == ""){
        this.user.username = this.global.actualUser.username;
      }
      else{
        //Comprobamos que no hay un usuario con el mismo nombre de usuario en la BD
        for (let i = 0; i < this.users.length; i++) {
          if(this.users[i].username == this.data.newUsername){
            this.alreadyUser = true;
          }
        }
      }

      if(this.data.newPassword == undefined || this.data.newPassword == ""){
        this.user.password = this.global.actualUser.password;
      }
      else{
        this.user.password = this.data.newPassword;
      }

      if(this.alreadyUser){
        console.log('usuario repe');
      }
      else{
        this.user.username = this.data.newUsername;
        this.user.id = this.global.actualUser.id;

        this.fs.updateUser(this.user);
        this.onNoClick();
      }


    }

}
