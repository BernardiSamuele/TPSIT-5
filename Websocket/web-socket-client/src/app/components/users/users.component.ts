import { Component } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  constructor(
    public dataStorageService: DataStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataStorageService.getUsers();
  }

  onUserClick(user: any) {
    console.info(user);
    this.dataStorageService.selectedUser = user;
    this.dataStorageService.patchUser(user._id);
    this.router.navigate(['/home']);
  }
}
