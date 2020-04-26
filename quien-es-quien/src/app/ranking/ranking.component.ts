import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { User } from '../user';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  public users: User[];

  constructor(private fs: FirestoreService) {

    //this.users = fs.getUsers();
    console.log(fs.getUsers());

   }

  ngOnInit(): void {
  }


}
