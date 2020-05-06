import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class RoomSelectorComponent implements OnDestroy {

  private subsc:any;

  constructor(private fs: FirestoreService, private cookieService: CookieService, public router: Router,
    public route: ActivatedRoute, private global:GlobalService) {

   }

  ngOnDestroy():void{
    if(this.subsc!=undefined){
      this.subsc.unsubscribe();

    }
  }

  public submit(event:any){
    const room=event.target.firstChild.value;

    this.subsc =  this.fs.getRooms(room).subscribe(r=>{
      
      //creamos una estructura de datos para pasar por la url
      let data={
        player:"0",  //player:string contiene el id del jugador, 0 o 1
        gameid: r[0].idGame
      }

      this.global.renewCookies(this.cookieService);

      this.router.navigate(['/npc-selector'],
        {
          state: { data: data }//Pasamos los datos por la url
  
        }   
      );

    });

  }

}
