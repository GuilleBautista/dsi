import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService } from '../services/global/global.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  public username:string;
  public level:number;


  constructor(private fs: FirestoreService, private router: Router, private route: ActivatedRoute,  public global: GlobalService) {
    this.username = this.global.actualUser.username;
    this.level = this.global.actualUser.level;

  }

  ngOnInit(): void{
  }

}
