import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { User } from '../user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  public users: User[];
  public s_users: Subscription;
  public loaded: boolean;

  constructor(private fs: FirestoreService) {
    this.loaded = false;
   }

  ngOnInit(): void {
    this.s_users=this.fs.getOrderedUsers().subscribe(data=>{
      this.users = data;
      this.loaded = true;
      console.log(this.users);

    });
  }

  ngOnDestroy(){RankingComponent
    this.s_users.unsubscribe();
  }

}
