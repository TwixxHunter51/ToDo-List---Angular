import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})

export class ToDoComponent implements OnInit{
  tasks: { name: string; originalName: string; expiry: number; editing: boolean; expiresIn?:number;expires?:boolean }[] = [];
  ctasks: { name: string; originalName: string; expiry: number;editing: boolean; }[] = [];  
  etasks: { name: string; originalName: string; expiry: number;editing: boolean; }[] = [];  
  completedCount: number = 0;
  expiredCount : number=0;
  taskForm!: FormGroup;


  constructor(private formBuilder: FormBuilder , private toastr: ToastrService,private http: HttpClient) {}
  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      task: ['', Validators.required],
      expiry: ['', Validators.pattern(/^\d+$/)] 
    });
  }
  
  addTask() {
    if (this.taskForm.valid) {
      const newTask = this.taskForm.get('task')!.value.trim();
      const expiryTime = +this.taskForm.get('expiry')!.value;
     
      if (newTask !== '') {
        const taskToAdd = { name: newTask, originalName:newTask,expiry : expiryTime,editing:false,
          expiresIn: expiryTime, expires:true  };
      if(!this.tasks.find(t=> t.name.toLowerCase()==taskToAdd.name.toLowerCase())){
        this.tasks.push(taskToAdd);
        this.tasks.sort((a, b) => a.expiry - b.expiry);
        if(taskToAdd.expiry>0)
        {this.startCountdownForTask(taskToAdd);} 
        this.taskForm.reset();
      }
      else{
        this.toastr.error('Task with same name exists already.')
      }
    }
  }
  }
  startCountdownForTask(task: any) {
    const taskExpiresAt=Math.floor((Date.now() / 1000)+task.expiry);
    const interval = setInterval(() => {
      const remainingTime = taskExpiresAt - Math.floor(Date.now() / 1000); 
  
      if (remainingTime <= 0 && this.tasks.find(t => t.name=task.name)) {
        clearInterval(interval);
        task.expiresIn = 0;
        this.moveToExpiry(task, this.tasks.indexOf(task));
      } else {
        task.expiresIn = remainingTime;
      }
    }, 1000);
  }

  moveToCompleted(task: { name: string; originalName: string;expiry: number; editing: boolean; expires?:boolean}, index: number) {
    task.expires=false;
    this.ctasks.unshift(task);
    this.tasks.splice(index, 1);
    this.updateCompletedCount();
    this.toastr.success('Task completed successfully!', 'Congratulations!');
  }
  moveToExpiry(task: { name: string; originalName: string;expiry: number; editing: boolean; expires:boolean}, index: number) {
    if(this.tasks.find(t=> t.name==task.name) && task.expires)
    {
      this.etasks.unshift(task);
      this.tasks.splice(index, 1);
      this.updateExpiredCount();
      this.toastr.warning('Task expired!', 'Warning!');
    }
  }

  deleteTask(index: number) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks.splice(index, 1);
    this.updateCompletedCount(); 
    this.updateExpiredCount();
      this.toastr.success('Task deleted successfully!');
    }
  } 

  deleteCompletedTask(index: number) {
    if (index >= 0 && index < this.ctasks.length) {
      this.ctasks.splice(index, 1);
      this.updateCompletedCount();
      this.toastr.success('Task deleted successfully!');
    }
  }
  deleteExpiredTask(index: number) {
    if (index >= 0 && index < this.etasks.length) {
      this.etasks.splice(index, 1);
      this.updateExpiredCount();
      this.toastr.success('Task deleted successfully!');
    }
  }
  
  updateCompletedCount() {
    this.completedCount = this.ctasks.length;
  }
  updateExpiredCount() {
    this.expiredCount = this.etasks.length;
  }

  startEditing(task: { name: string, editing: boolean }) {
    task.editing = true;
  }

  saveTask(task: { name: string, originalName:string,editing: boolean }) {
    if(task.name!='')
    {task.editing = false;
    task.originalName=task.name;
    this.toastr.success('Task edited successfully!');
    }
  }

  cancelEdit(task: { name: string,originalName:string, editing: boolean }) {
    task.editing = false;
    task.name = task.originalName;
  }

  dropActiveToCompleted(event: CdkDragDrop<{ name: string; originalName: string; expiry: number;editing: boolean; }[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex); 
      this.toastr.success('Task priority changed!');
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updateCompletedCount();
      this.toastr.show('Just decide already!' , 'WOW MAN');
    }
  }

  dropCompletedToActive(event: CdkDragDrop<{ name: string; originalName: string;expiry: number; editing: boolean; }[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.ctasks, event.previousIndex, event.currentIndex); 
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updateCompletedCount();
      this.toastr.success('Task completed successfully!' , 'Congratulations!');
    }
  }
}