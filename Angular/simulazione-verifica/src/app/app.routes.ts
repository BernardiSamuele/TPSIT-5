import { Routes } from '@angular/router';
import { FilmListComponent } from './film-list/film-list.component';
import { FilmDetailsComponent } from './film-details/film-details.component';
import { FilmPlayComponent } from './film-play/film-play.component';

export const routes: Routes = [
  {
    path: '',
    component: FilmListComponent,
  },
  {
    path: 'details/:id',
    component: FilmDetailsComponent,
  },
  {
    path: 'play/:video',
    component: FilmPlayComponent,
  },
];
