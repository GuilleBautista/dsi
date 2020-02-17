import { Injectable } from '@angular/core';
import { Alumno, Grupo } from './alumno.model';

@Injectable()
export class AlumnosService {

  private alumnos: Alumno[];
  private grupos: Grupo[];

  constructor() {
    this.grupos = [
      {
        id: 0,
        nombre: 'Sin Asignar'
      },
      {
        id: 1,
        nombre: 'Grupo Blanco'
      },
      {
        id: 2,
        nombre: 'Grupo Negro'
      },
      {
        id: 3,
        nombre: 'Grupo Azul'
      },
      {
        id: 4,
        nombre: 'Grupo Verde'
      },
      {
        id: 4,
        nombre: 'Grupo Amarillo'
      },
      {
        id: 4,
        nombre: 'Grupo Rojo'
      },
    ];

    this.alumnos = [];
  }

  getGrupos() {
    return this.grupos;
  }

  getAlumnos() {
    return this.alumnos;
  }

  agregarAlumno(alumno: Alumno) {
    this.alumnos.push(alumno);
  }

  nuevoAlumno(): Alumno {
    return {
      id: this.alumnos.length,
      nia: '',
      nombre: '',
      apellidos: '',
      grupo: 0
    };
  }
}
