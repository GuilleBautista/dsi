import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'coches';

  public micoche = new Coche();
  public micoche2 = new Coche();
  public micoche3 = new Coche();
  public micoche4 = new Coche();


}

export class Coche{
  public photo;
  public brand;
  public model;
  public year;
  public release_date;
  public price;
  public pvp;

  constructor(){
    this.photo="../assets/mustang.jpg";
    this.brand="marca";
    this.model="modelo";
    this.year="1999";
    this.release_date="1999";
    this.price=1000;
    this.pvp=34;
  }

  public low_price(){
    this.price*=0.9;
  }

  public sell(){
    alert('hi');
  }


};
