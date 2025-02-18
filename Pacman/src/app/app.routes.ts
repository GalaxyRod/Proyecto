import { Routes } from '@angular/router';
import { MenuComponent, PacmanComponent } from './components/index.components';

export const routes: Routes = [
    {
        path: '',
        component: MenuComponent
    },
    {
        path: 'pacman',
        component: PacmanComponent
    }
];

