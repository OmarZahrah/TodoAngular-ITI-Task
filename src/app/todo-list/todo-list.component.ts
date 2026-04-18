import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from './task.interface';
import { TodoListService } from './todo-list.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  standalone: false,
})
export class TodoListComponent implements OnInit {
  private readonly todoService = inject(TodoListService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly validationTitle = 'Validation Error';
  private readonly requestTitle = 'Request Error';

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  readonly tabs: TodoFilter[] = ['all', 'todo', 'completed'];
  currentFilter: TodoFilter = 'all';
  searchControl = new FormControl('', { nonNullable: true });
  taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100), Validators.minLength(3)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(300), Validators.minLength(5)],
    }),
  });
  private currentSearch = '';

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.currentFilter = this.readFilterFromParams(params.get('status'));
      this.applyFilters();
    });

    this.loadTasks();

    this.searchControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.refreshTasks(value ?? '');
    });
  }

  setStatusFilter(filter: TodoFilter): void {
    const queryParams: Params = filter === 'all' ? { status: null } : { status: filter };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  addTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.showValidationErrorToast();
      return;
    }

    this.todoService.addTask(this.titleValue, this.descriptionValue).subscribe({
      next: () => {
        this.refreshTasks(this.currentSearch);
        this.taskForm.reset({
          title: '',
          description: '',
        });
        this.toastr.success('Task created successfully.', 'Success');
      },
      error: () => {
        this.toastr.error('Could not create task. Try again.', this.requestTitle);
      },
    });
  }

  deleteTask(taskId: number): void {
    this.todoService.deleteTask(taskId).subscribe({
      next: () => {
        this.refreshTasks(this.currentSearch);
        this.toastr.success('Task deleted successfully.', 'Deleted');
      },
      error: () => {
        this.toastr.error('Could not delete task. Try again.', this.requestTitle);
      },
    });
  }

  completeTask(taskId: number, done: boolean): void {
    this.todoService.completeTask(taskId, done).subscribe({
      next: () => {
        this.refreshTasks(this.currentSearch);
      },
      error: () => {
        this.toastr.error('Could not update task state.', this.requestTitle);
      },
    });
  }

  private get titleValue(): string {
    return this.taskForm.controls.title.getRawValue();
  }

  private get descriptionValue(): string {
    return this.taskForm.controls.description.getRawValue();
  }

  private refreshTasks(searchValue: string): void {
    this.currentSearch = searchValue;
    this.todoService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: () => {
        this.toastr.error('Could not load tasks from API.', this.requestTitle);
      },
    });
  }

  private loadTasks(): void {
    this.todoService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: () => {
        this.toastr.error('Could not load tasks from API.', this.requestTitle);
      },
    });
  }

  private applyFilters(): void {
    const searched = this.filterByTitle(this.tasks, this.currentSearch);
    this.filteredTasks = this.filterByStatus(searched, this.currentFilter);
  }

  private filterByTitle(tasks: Task[], searchValue: string): Task[] {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return tasks;
    }

    return tasks.filter(({ title }) => title.toLowerCase().includes(query));
  }

  private filterByStatus(tasks: Task[], filter: TodoFilter): Task[] {
    if (filter === 'todo') {
      return tasks.filter(({ done }) => !done);
    }

    if (filter === 'completed') {
      return tasks.filter(({ done }) => done);
    }

    return tasks;
  }

  private readFilterFromParams(rawFilter: string | null): TodoFilter {
    if (rawFilter === 'todo' || rawFilter === 'completed') {
      return rawFilter;
    }

    return 'all';
  }

  private showValidationErrorToast(): void {
    const titleControl = this.taskForm.get('title');
    const descriptionControl = this.taskForm.get('description');

    if (!titleControl) {
      this.toastr.error('Please review the form and try again.', this.validationTitle);
      return;
    }

    if (titleControl.hasError('required')) {
      this.toastr.error('Task title is required.', this.validationTitle);
      return;
    }

    if (titleControl.hasError('minlength')) {
      this.toastr.error('Task title must be at least 3 characters.', this.validationTitle);
      return;
    }

    if (titleControl.hasError('maxlength')) {
      this.toastr.error('Task title cannot exceed 100 characters.', this.validationTitle);
      return;
    }

    if (!descriptionControl) {
      this.toastr.error('Please review the form and try again.', this.validationTitle);
      return;
    }

    if (descriptionControl.hasError('required')) {
      this.toastr.error('Task description is required.', this.validationTitle);
      return;
    }

    if (descriptionControl.hasError('minlength')) {
      this.toastr.error('Task description must be at least 5 characters.', this.validationTitle);
      return;
    }

    if (descriptionControl.hasError('maxlength')) {
      this.toastr.error('Task description cannot exceed 300 characters.', this.validationTitle);
      return;
    }

    this.toastr.error('Please review the form and try again.', this.validationTitle);
  }
}

type TodoFilter = 'all' | 'todo' | 'completed';
