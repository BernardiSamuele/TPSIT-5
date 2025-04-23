import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChatComponent } from './components/chat/chat.component';
import { UsersComponent } from './components/users/users.component';
import { RoomsComponent } from './components/rooms/rooms.component';


export const routes: Routes = [
    {	path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {	path: 'home',         // senza slash !
        component: HomeComponent
    },
    {	path: 'utenti',   // senza slash !
        component: UsersComponent
    },
    {	path: 'stanze',   // senza slash !
        component: RoomsComponent
    },
    {	path: 'chat',   // senza slash !
        component: ChatComponent
    }
];
