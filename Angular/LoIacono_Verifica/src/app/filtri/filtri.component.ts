import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-filtri',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filtri.component.html',
  styleUrl: './filtri.component.css'
})
export class FiltriComponent {
  ordinamento: number = 0
  @Output() ordina = new  EventEmitter<any>()
  @Output() categoriaCambiata = new EventEmitter<any>()

  categorie = ['All','Giacche','Pantaloni','Maglie','Accessori']
  selectedCategoria : any = "All"

  ordinaCrescente(){
    this.ordinamento = 1
    this.ordina.emit(this.ordinamento)
  }
  ordinaDecrescente(){
    this.ordinamento = -1
    this.ordina.emit(this.ordinamento)
  }
  
  onChangeCategoria(){
    console.log(this.selectedCategoria)
    this.categoriaCambiata.emit(this.selectedCategoria)
  }
}
