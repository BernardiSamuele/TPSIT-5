import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilmListComponent } from './film-list/film-list.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'simulazione-verifica';
}
