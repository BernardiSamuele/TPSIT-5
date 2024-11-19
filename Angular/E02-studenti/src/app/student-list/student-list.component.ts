import { Component, ElementRef, ViewChild } from '@angular/core';
import { StudentComponent } from '../student/student.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [StudentComponent, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css',
})
export class StudentListComponent {
  @ViewChild('txtName') _txtName!: ElementRef;
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

  ngAfterViewInit() {
    this._txtName.nativeElement.focus();
  }

  onCreateStudent() {
    console.log(this.studentName, this.studentGender, this.studentCity);
    let newStudent = {
      name: this.studentName,
      gender: this.studentGender,
      city: this.studentCity,
      present: false,
    };

    this.studentList.push(newStudent);
    this.studentName = '';
    this.studentGender = 'M';
    this.studentCity = '';

    this._txtName.nativeElement.focus();
  }

  // onDeleteStudent(pos: number) {
  //   this.studentList.splice(pos, 1);
  // }
  onDeleteStudent(student: any) {
    let pos = this.studentList.indexOf(student);
    this.studentList.splice(pos, 1);
  }

  cities: string[] = ['Fossano', 'Torino', 'Cuneo', 'Alba', 'Canale'];
  studentName: any;
  studentGender: any = 'M';
  studentCity: any;
}
