import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { cookie_time } from '../global';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.scss']
})
export class RoomSelectorComponent implements OnInit {

  constructor(private fs: FirestoreService, private cookieService: CookieService, public router: Router, public route: ActivatedRoute) {

   }

  ngOnInit(): void {
  }

  public submit(event:any){
    const room=event.target.firstChild.value;

    this.fs.getRooms(room).subscribe(r=>{
      this.cookieService.set("cookieGame", r[0].idGame, cookie_time);
      this.router.navigate(['/game']);
    });    
    
  }
  
}
