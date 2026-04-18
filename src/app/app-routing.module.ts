import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { DemoPublicComponent } from './demo-public/demo-public.component';
import { DemoProtectedComponent } from './demo-protected/demo-protected.component';
import { AuthGuard } from './auth-guard';

const routes: Routes = [
  { path: '', component: TodoListComponent },
  { path: 'demo-public', component: DemoPublicComponent },
  { path: 'demo-protected', component: DemoProtectedComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
