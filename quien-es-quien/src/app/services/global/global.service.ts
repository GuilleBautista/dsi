import { Injectable } from '@angular/core';
import { User } from '../../user';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public actualUser:User;

  constructor() { }
}
