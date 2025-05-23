import { NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent {
  student: any = {};
  studentList: any[] = [
    { name: 'pippo', city: 'Fossano', gender: 'M', present: true },
    { name: 'pluto', city: 'Cuneo', gender: 'M', present: true },
    { name: 'minnie', city: 'Alba', gender: 'F', present: false },
    { name: 'sonny', city: 'Torino', gender: 'M', present: true },
    { name: 'sally', city: 'Fossano', gender: 'F', present: true },
    { name: 'elly', city: 'Genola', gender: 'F', present: true },
    { name: 'fanny', city: 'Cuneo', gender: 'M', present: false },
    { name: 'sandy', city: 'Alba', gender: 'F', present: true },
    { name: 'john', city: 'Torino', gender: 'M', present: true },
    { name: 'joe', city: 'Torino', gender: 'M', present: true },
    { name: 'jack', city: 'Fossano', gender: 'M', present: true },
  ];
  constructor() {
    let pos = this.generaNumero(0, this.studentList.length);
    this.student = this.studentList[pos];
  }

  getStyle(student: any) {
    return {
      backgroundColor: student.gender == 'F' ? 'pink' : 'cyan',
      fontStyle: student.gender == 'F' ? 'italic' : 'none',
      textDecoration: !student.present ? 'underline' : '',
    };
  }

  // b escluso
  generaNumero(a: number, b: number) {
    return Math.floor((b - a) * Math.random()) + a;
  }
}
