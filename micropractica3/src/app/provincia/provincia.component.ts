import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.css']
})
export class ProvinciaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() public comunity:string;

}
