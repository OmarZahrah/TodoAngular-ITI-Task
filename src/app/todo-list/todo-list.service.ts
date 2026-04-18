import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  private readonly apiUrl = 'http://localhost:3000/tasks';

  constructor(private readonly http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(title: string, description: string): Observable<Task> {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      throw new Error('Task title is required.');
    }

    if (!trimmedDescription) {
      throw new Error('Task description is required.');
    }

    return this.http.post<Task>(this.apiUrl, {
      title: trimmedTitle,
      description: trimmedDescription,
      done: false,
      date: new Date().toISOString(),
    });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  completeTask(id: number, done: boolean): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, { done });
  }
}
