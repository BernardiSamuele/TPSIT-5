import { Component } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { FilmsService } from '../shared/films.service';

@Component({
  selector: 'app-film-details',
  imports: [RouterLink],
  templateUrl: './film-details.component.html',
  styleUrl: './film-details.component.css',
})
export class FilmDetailsComponent {
  playVideo() {
    this.filmsService.addView(this.film._id)?.subscribe({
      next: (response) => {
        this.router.navigate(['play', this.film.video]);
      },
      error: (error) => {
        console.log('Error adding view:', error);
      },
    });
  }
  film: any;
  constructor(
    private dataStorageService: DataStorageService,
    private activatedRoute: ActivatedRoute,
    private filmsService: FilmsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.film = this.dataStorageService
        .sendRequest('GET', `/film/${params['id']}`)
        ?.subscribe({
          next: (response) => {
            this.film = response;
          },
          error: (error) => {
            console.log('Error fetching film details:', error);
          },
        });
    });
  }
}
