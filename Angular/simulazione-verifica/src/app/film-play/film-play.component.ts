import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-film-play',
  imports: [RouterLink],
  templateUrl: './film-play.component.html',
  styleUrl: './film-play.component.css',
})
export class FilmPlayComponent implements OnInit {
  video: any = '';
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.video = params['video'];
    });
  }
}
