import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



interface MyObj {
  Hola: string;
}

@Component({
  selector: 'app-set-selector',
  templateUrl: './set-selector.component.html',
  styleUrls: ['./set-selector.component.scss']
})

export class SetSelectorComponent implements OnInit {
  
  
  //Matriz para el tablero
  public Sets:Array<any>;

  constructor(public router: Router, public route: ActivatedRoute) {

    this.Sets=[
      {
        "route": 'assets/sets/1.png',
        "id": 0
       },
       {
        "route": 'assets/sets/1.png (copy)', 
        "id": 1
       },
       {
         "route": 'assets/sets/2.png',
         "id": 2
        }

      ];

  }

  ngOnInit(): void {
  }

  select(id:Number){
    this.router.navigate(['/game'],     // En URL y participan en el routing.
    //{param_extra1:'XXX',param_extra2:57}],  // Se pasan codificados en la url.
    { state: { param_not_in_url: id }}   // No se muestran en la URL
    );
  }

}
