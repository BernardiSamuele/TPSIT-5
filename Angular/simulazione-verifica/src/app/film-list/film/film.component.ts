import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-film',
  imports: [RouterLink],
  templateUrl: './film.component.html',
  styleUrl: './film.component.css',
})
export class FilmComponent {
  @Input() film: any;
}
