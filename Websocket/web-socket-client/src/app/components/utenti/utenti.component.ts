import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';

@Component({
  selector: 'app-utenti',
  imports: [],
  templateUrl: './utenti.component.html',
  styleUrl: './utenti.component.css',
})
export class UtentiComponent implements OnInit {
  constructor(public dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    this.dataStorageService.getUsers();
  }
}
