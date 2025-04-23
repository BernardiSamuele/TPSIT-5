import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UtentiComponent } from './utenti/utenti.component';
import { StanzeComponent } from './stanze/stanze.component';
import { ChatComponent } from './chat/chat.component';


export const routes: Routes = [
    {	path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {	path: 'home',         // senza slash !
        component: HomeComponent
    },
    {	path: 'utenti',   // senza slash !
        component: UtentiComponent
    },
    {	path: 'stanze',   // senza slash !
        component: StanzeComponent
    },
    {	path: 'chat',   // senza slash !
        component: ChatComponent
    }
];
