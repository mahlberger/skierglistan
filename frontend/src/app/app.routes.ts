import { Routes } from '@angular/router';
import { ListComponent } from './list/list';
import { FacilityCreateComponent } from './facility-create/facility-create';
import { FacilityEditComponent } from './facility-edit/facility-edit';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  {
    path: 'facilities/new',
    component: FacilityCreateComponent
  },
  {
    path: 'facilities/:id/edit',
    component: FacilityEditComponent
  }
];
