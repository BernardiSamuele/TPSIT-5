import { Component } from '@angular/core';
import { DettagliVestitiComponent } from '../dettagli-vestiti/dettagli-vestiti.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
import { FiltriComponent } from '../filtri/filtri.component';
import { VestitiService as VestitiService } from '../vestiti.service';

@Component({
  selector: 'app-lista-vestiti',
  standalone: true,
  imports: [
    DettagliVestitiComponent,
    FormsModule,
    NgStyle,
    NgClass,
    FiltriComponent,
  ],
  templateUrl: './lista-vestiti.component.html',
  styleUrl: './lista-vestiti.component.css',
})
export class ListaVestitiComponent {
  vestitoSelezionato: any;

  nomeVestito: any;
  categoriaVestito: any;
  tagliaVestito: any;
  prezzoVestito: any;
  descrizioneVestito: any;
  urlVestito: any;

  constructor(public vestitiService: VestitiService) {
    this.vestitiService.getVestiti();
  }

  seeDetails(vestito: any) {
    this.vestitoSelezionato = vestito;
  }

  aggiungiVestito() {
    const newVestito = {
      Nome: this.nomeVestito,
      Categoria: this.categoriaVestito,
      Taglia: this.tagliaVestito,
      Prezzo: this.prezzoVestito,
      Descrizione: this.descrizioneVestito,
      Immagine: this.urlVestito,
    };

    this.vestitiService.vestiti.push(newVestito);
    this.nomeVestito = '';
    this.categoriaVestito = '';
    this.tagliaVestito = '';
    this.descrizioneVestito = '';
    this.urlVestito = '';
    this.prezzoVestito = 0;
  }

  categoria: any = '';
  eliminaVestito(vestito: any) {
    let pos = this.vestitiService.vestiti.indexOf(vestito);
    this.vestitiService.vestiti.splice(pos, 1);
  }

  ordinaVestiti(ordine: any) {
    console.log(ordine);
    if (ordine == 1) {
      this.vestitiService.vestiti.sort(function (item1, item2) {
        let str1 = item1.Prezzo;
        let str2 = item2.Prezzo;
        if (str1 < str2) return -1;
        else if (str1 > str2) return 1;
        else return 0;
      });
    } else {
      this.vestitiService.vestiti.sort(function (item1, item2) {
        let str1 = item1.Prezzo;
        let str2 = item2.Prezzo;
        if (str1 > str2) return -1;
        else if (str1 < str2) return 1;
        else return 0;
      });
    }
  }

  cambiaCategoria(selectedCategoria: any) {
    this.categoria = selectedCategoria;
  }
}
