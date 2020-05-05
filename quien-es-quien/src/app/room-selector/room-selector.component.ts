import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { cookie_time } from '../global';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global/global.service';

@Component({
  selector: 'app-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.scss']
})
export class RoomSelectorComponent implements OnInit {

  constructor(private fs: FirestoreService, private cookieService: CookieService, public router: Router, 
    public route: ActivatedRoute, private global:GlobalService) {

   }

  ngOnInit(): void {
  }

  public submit(event:any){
    const room=event.target.firstChild.value;

    this.fs.getRooms(room).subscribe(r=>{
      this.cookieService.set("cookieGame", r[0].idGame, cookie_time);

      //El jugador que se une jugara primero
      this.cookieService.set("player", "0", cookie_time)

      this.global.renewCookies(this.cookieService);

      // Con la cookie cambiada redirigimos a la partida
      this.router.navigate(['/game']);
    });    
    
  }

  
}
