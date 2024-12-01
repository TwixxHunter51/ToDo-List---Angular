// task.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks: { name: string; expiry: number; editing: boolean; originalName: string }[] = [];

  addTask(newTask: { name: string; expiry: number }) {
    this.tasks.unshift({
      name: newTask.name,
      expiry: newTask.expiry,
      editing: false,
      originalName: newTask.name,
    });
  }

  getTasks() {
    return this.tasks;
  }
}
