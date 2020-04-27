import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FirestoreService } from '../services/firestore/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService } from '../services/global/global.service';

//Interfaz del dialog
export interface DialogData {
  username: string;
  name: string;
  level:number;
  points:number;
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
      width: '22%',
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

    //Constructor
    constructor(public dialogRef: MatDialogRef<editDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    ngOnInit() {}

    onNoClick(): void {
      this.dialogRef.close();
    }

}
