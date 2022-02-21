import { Component, Input } from '@angular/core';
import { ToDo } from '../todo';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss']
})
export class TodoCardComponent  {
  @Input() todo: ToDo;
  @Input() simple?: boolean = false;
}
