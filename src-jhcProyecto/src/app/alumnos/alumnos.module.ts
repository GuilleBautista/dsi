import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnosService } from './alumnos.service';
import { AltaAlumnoComponent } from './alta-alumno/alta-alumno.component';
import { ListadoAlumnosComponent } from './listado-alumno/listado-alumnos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    AltaAlumnoComponent,
    ListadoAlumnosComponent
  ],
  exports: [
    AltaAlumnoComponent,
    ListadoAlumnosComponent
  ],
  providers: [
    AlumnosService
  ]
})
export class AlumnosModule { }
