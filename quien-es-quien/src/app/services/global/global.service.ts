import { Injectable } from '@angular/core';
import { User } from '../../clases/user';
import { CookieService } from 'ngx-cookie-service';
import { cookie_time } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public actualUser:User;

  constructor() { }

  public renewCookies(ck:CookieService){

    ck.set("player", ck.get("player"), cookie_time);
    ck.set("uid", ck.get("uid"), cookie_time);
    ck.set("cookieGame", ck.get("cookieGame"), cookie_time);
    ck.set("page", ck.get("page"), cookie_time);


  }
}
