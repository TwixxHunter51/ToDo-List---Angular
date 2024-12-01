import { Component,Input,Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
 @Input() taskForm!: FormGroup;
@Output() taskaddition: EventEmitter<void> = new EventEmitter<void>();
  
  addTask(taskForm:FormGroup){
    this.taskaddition.emit();
  }
}