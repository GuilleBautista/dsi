import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../user';

import { GlobalService } from '../services/global/global.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  public username:string;
  public level:number;

  public profilePicH:string;

  public user: User;


  constructor(private fs: FirestoreService, private router: Router, private route: ActivatedRoute,  public global: GlobalService) {

    this.user=new User(this.global.actualUser.name, this.global.actualUser.username, this.global.actualUser.password, this.global.actualUser.level, this.global.actualUser.points, this.global.actualUser.id,this.global.actualUser.profilePhotoURL);

    this.username = this.user.username;
    this.level = this.user.level;
    this.profilePicH = this.user.profilePhotoURL;

    if (this.profilePicH == "") {
      this.fs.getImg("profilePhotos/user.svg").subscribe(url=>{
        this.profilePicH=url;
        this.user.profilePhotoURL=url;
        console.log(this.profilePicH);
      });

      this.fs.updateUser(this.user);

    }
    else{
      this.fs.getImg("profilePhotos/"+this.user.id).subscribe(url=>{
        this.profilePicH=url;
      });

      this.fs.updateUser(this.user);

    }
  }

  ngOnInit(): void{
  }

}
