import { Alumno, Grupo } from './../alumno.model';
import { AlumnosService } from './../alumnos.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alta-alumno',
  templateUrl: './alta-alumno.component.html',
  styleUrls: ['./alta-alumno.component.css']
})
export class AltaAlumnoComponent implements OnInit {

  alumno: Alumno;
  grupos: Grupo[];

  constructor(private alumnosService: AlumnosService) { }

  ngOnInit() {
    this.alumno = this.alumnosService.nuevoAlumno();
    this.grupos = this.alumnosService.getGrupos();
  }

  nuevoAlumno(): void {
    this.alumnosService.agregarAlumno(this.alumno);
    this.alumno = this.alumnosService.nuevoAlumno();
  }
}
