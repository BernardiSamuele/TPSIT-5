import { Component, EventEmitter, Input, Output } from '@angular/core';
import Event from '../../../models/event.model';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  @Input() event!: Event;

  onSubscriberAdded() {
    this.event.subscribers++;
  }

  onSubscribersReset() {
    this.event.subscribers = 0;
  }
}
