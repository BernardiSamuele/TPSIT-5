import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  public films: any = [];
  public genres: any = [];
  public selectedFilms: any = [];

  constructor(private dataStorageService: DataStorageService) {}

  getALlFilms(): void {
    this.dataStorageService.sendRequest('GET', '/film')?.subscribe({
      next: (response) => {
        this.films = response;
        this.selectedFilms = this.films;
      },
      error: (error) => {
        console.log('Error fetching films:', error);
      },
    });
  }

  getFilmsByName(selectedFilmName: string): void {
    this.dataStorageService
      .sendRequest('GET', `/filmSearch/film/${selectedFilmName}`)
      ?.subscribe({
        next: (response) => {
          this.selectedFilms = response;
        },
        error: (error) => {
          console.log('Error fetching films:', error);
        },
      });
  }

  getAllGenres(): void {
    this.dataStorageService.sendRequest('GET', '/generi')?.subscribe({
      next: (response) => {
        this.genres = response;
      },
      error: (error) => {
        console.log('Error fetching films:', error);
      },
    });
  }

  addView(id: number): Observable<any> | undefined {
    return this.dataStorageService.sendRequest('PUT', `/film/${id}/`, {
      $inc: { nVisualizzazioni: 1 },
    });
  }
}
