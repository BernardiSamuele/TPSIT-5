import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [NgClass],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent {
  @Input() student: any;

  ngOnInit() {
    let num = this.generaNumero(1, 3);
    this.student.present = num == 1;
  }

  generaNumero(a: number, b: number) {
    return Math.floor((b - a) * Math.random()) + a;
  }

  onStudentClick() {
    this.student.present = !this.student.present;
  }
}
