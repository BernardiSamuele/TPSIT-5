import { Component, OnInit } from '@angular/core';
import { FilmComponent } from './film/film.component';
import { FilmsService } from '../shared/films.service';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-film-list',
  imports: [FilmComponent, FormsModule],
  templateUrl: './film-list.component.html',
  styleUrl: './film-list.component.css',
})
export class FilmListComponent implements OnInit {
  onChangeFilmName() {
    this.selectedCategory = '*';
    if (this.selectedFilmName === '') {
      this.filmsService.selectedFilms = this.filmsService.films;
    } else {
      this.filmsService.getFilmsByName(this.selectedFilmName);
    }
  }
  onChangeCategoria() {
    this.selectedFilmName = '';
    this.filmsService.selectedFilms = this.filmsService.films.filter(
      (f: any) =>
        f.genere === this.selectedCategory || this.selectedCategory === '*'
    );
  }
  selectedCategory: any;
  selectedFilmName = '';

  filterFilmsByGenre() {}
  constructor(public filmsService: FilmsService) {}

  ngOnInit(): void {
    this.filmsService.getALlFilms();
    this.filmsService.getAllGenres();
  }
}
