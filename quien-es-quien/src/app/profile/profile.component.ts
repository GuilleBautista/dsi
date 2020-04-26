import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService } from '../services/global/global.service';


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



  constructor(private fs: FirestoreService, private router: Router, private route: ActivatedRoute, public global: GlobalService) {
    this.name = this.global.actualUser.name;
    this.username = this.global.actualUser.username;
    this.level = this.global.actualUser.level;
    this.points = this.global.actualUser.points;


  }

  ngOnInit(): void {
  }


}
