import { Routes } from '@angular/router';
import { MedicationStockComponent } from './features/medication-stock/medication-stock.component';
import { LoveComponent } from './features/love/love.component';

export const routes: Routes = [
  {
    path: '',
    component: MedicationStockComponent,
  },
  {
    path: 'love',
    component: LoveComponent,
  },
];
