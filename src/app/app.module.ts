import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './header/header.component';
import { TodoItemComponent } from './todo-list/todo-item/todo-item.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AppRoutingModule } from './app-routing.module';
import { DemoPublicComponent } from './demo-public/demo-public.component';
import { DemoProtectedComponent } from './demo-protected/demo-protected.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    TodoItemComponent,
    TodoListComponent,
    DemoPublicComponent,
    DemoProtectedComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      timeOut: 2800,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
    }),
  ],
  exports: [],
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
