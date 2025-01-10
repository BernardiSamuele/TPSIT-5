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
    { name: 'Tech Innovations 2024', subscribers: 150 },
    { name: 'Marketing Strategies Summit', subscribers: 250 },
    { name: 'AI & Machine Learning Conference', subscribers: 350 },
    { name: 'Health & Wellness Expo', subscribers: 400 },
    { name: 'Sustainable Living Fair', subscribers: 450 },
    { name: 'Web Development Bootcamp', subscribers: 300 },
    { name: 'Local Art Showcase', subscribers: 100 },
    { name: 'Startup Pitch Night', subscribers: 500 },
    { name: 'International Food Festival', subscribers: 600 },
    { name: 'Digital Nomad Meetup', subscribers: 200 },
    { name: 'Photography Masterclass', subscribers: 180 },
    { name: 'Personal Finance Workshop', subscribers: 320 },
    { name: 'Future of Mobility Summit', subscribers: 420 },
    { name: 'Community Volunteering Day', subscribers: 120 },
    { name: 'Gaming & Esports Expo', subscribers: 700 },
    { name: 'Introduction to Coding Workshop', subscribers: 80 },
    { name: 'Renewable Energy Forum', subscribers: 520 },
    { name: 'Cybersecurity Essentials Seminar', subscribers: 360 },
    { name: 'Music & Culture Festival', subscribers: 580 },
    { name: 'Startup Founders Roundtable', subscribers: 240 },
  ];

  newEventName: string = '';

  addEvent() {
    this.events.push({ name: this.newEventName, subscribers: 0 });
  }
}
