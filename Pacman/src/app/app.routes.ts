import { Routes } from '@angular/router';
import {
    MenuComponent,
    PacmanComponent,
    TypeGameComponent
} from './components/index.components';

export const routes: Routes = [
    {
        path: '',
        component: MenuComponent
    },
    {
        path: 'type',
        component: TypeGameComponent
    },
    {
        path: 'pacman',
        component: PacmanComponent
    }
];

