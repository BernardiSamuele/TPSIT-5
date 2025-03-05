import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaVestitiComponent } from "./lista-vestiti/lista-vestiti.component";
import { DettagliVestitiComponent } from "./dettagli-vestiti/dettagli-vestiti.component";
import { FiltriComponent } from "./filtri/filtri.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ListaVestitiComponent, DettagliVestitiComponent, FiltriComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Verifica - Lo Iacono';
}
