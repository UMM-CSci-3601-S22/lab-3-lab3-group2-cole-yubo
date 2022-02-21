import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToDo } from '../todo';
import { TodoService } from '../todos.service';

@Component({
  selector: 'app-todos-profile',
  templateUrl: './todos-profile.component.html',
  styleUrls: ['./todos-profile.component.scss']
})
export class TodosProfileComponent implements OnInit {

  todo: ToDo;
  id: string;

  constructor(private route: ActivatedRoute, private todoService: TodoService) { }

  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested user.
    this.route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id');
      this.todoService.getTodoById(this.id).subscribe(todo => this.todo = todo);
    });
  }


}
