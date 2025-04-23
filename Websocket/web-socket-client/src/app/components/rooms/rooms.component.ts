import { Component } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {
  constructor(public dataStorageService: DataStorageService, private router: Router) {}

  onClickRoom(event: any) {
    this.dataStorageService.selectedRoom = event.target.value;
    this.router.navigate(['/home']);
  }
}
