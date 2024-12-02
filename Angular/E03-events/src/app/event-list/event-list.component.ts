import { Component } from '@angular/core';
import { EventComponent } from './event/event.component';
import Event from '../../models/event.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventComponent, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
})
export class EventListComponent {
  events: Event[] = [
    { name: 'Event 1', subscribers: 145 },
    { name: 'Event 2', subscribers: 387 },
    { name: 'Event 3', subscribers: 592 },
    { name: 'Event 4', subscribers: 273 },
    { name: 'Event 5', subscribers: 812 },
    { name: 'Event 6', subscribers: 429 },
    { name: 'Event 7', subscribers: 78 },
    { name: 'Event 8', subscribers: 655 },
    { name: 'Event 9', subscribers: 936 },
    { name: 'Event 10', subscribers: 310 },
    { name: 'Event 11', subscribers: 185 },
    { name: 'Event 12', subscribers: 503 },
    { name: 'Event 13', subscribers: 740 },
    { name: 'Event 14', subscribers: 124 },
    { name: 'Event 15', subscribers: 870 },
    { name: 'Event 16', subscribers: 49 },
    { name: 'Event 17', subscribers: 623 },
    { name: 'Event 18', subscribers: 397 },
    { name: 'Event 19', subscribers: 715 },
    { name: 'Event 20', subscribers: 268 },
  ];

  newEventName: string = '';

  addEvent() {
    this.events.push({ name: this.newEventName, subscribers: 0 });
  }
}
