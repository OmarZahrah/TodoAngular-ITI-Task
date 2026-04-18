import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task.interface';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css',
  standalone: false,
})
export class TodoItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() deleteTask = new EventEmitter<void>();
  @Output() toggleTaskDone = new EventEmitter<boolean>();

  onDoneChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.toggleTaskDone.emit(checkbox.checked);
  }

  onDelete(): void {
    this.deleteTask.emit();
  }
}
