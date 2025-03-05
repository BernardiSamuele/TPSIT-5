import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dettagli-vestiti',
  standalone: true,
  imports: [],
  templateUrl: './dettagli-vestiti.component.html',
  styleUrl: './dettagli-vestiti.component.css'
})
export class DettagliVestitiComponent {
  @Input() vestito: any
}
