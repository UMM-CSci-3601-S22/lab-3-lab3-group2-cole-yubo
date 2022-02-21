import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToDo, ToDoStatus } from '../todo';
import { TodoService } from '../todos.service';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit {
// These are public so that tests can reference them (.spec.ts)
public serverFilteredTodos: ToDo[];
public filteredTodos: ToDo[];

public todoID: string;
public todoStatus: ToDoStatus;
public todoOwner: string;
public todoCategory: string;
// public viewType: 'card' | 'list' = 'card';

/**
 * This constructor injects both an instance of `UserService`
 * and an instance of `MatSnackBar` into this component.
 *
 * @param todoService the `UserService` used to get users from the server
 * @param snackBar the `MatSnackBar` used to display feedback
 */
constructor(private todoService: TodoService, private snackBar: MatSnackBar) {
  // Nothing here – everything is in the injection parameters.
}

/**
 * Get the users from the server, filtered by the role and age specified
 * in the GUI.
 */
getTodosFromServer() {
  this.todoService.getTodos({
    owner: this.todoOwner,
    category: this.todoStatus
  }).subscribe(returnedTodos => {
    // This inner function passed to `subscribe` will be called
    // when the `Observable` returned by `getUsers()` has one
    // or more values to return. `returnedUsers` will be the
    // name for the array of `Users` we got back from the
    // server.
    this.serverFilteredTodos = returnedTodos;
    this.updateFilter();
  }, err => {
    // If there was an error getting the users, log
    // the problem and display a message.
    console.error('We couldn\'t get the list of todos; the server might be down');
    this.snackBar.open(
      'Problem contacting the server – try again',
      'OK',
      // The message will disappear after 3 seconds.
      { duration: 3000 });
  });
}

/**
 * Called when the filtering information is changed in the GUI so we can
 * get an updated list of `filteredUsers`.
 */
public updateFilter() {
  this.filteredTodos = this.todoService.filterTodos(
    this.serverFilteredTodos, { owner: this.todoOwner, category: this.todoCategory }
  );
}

/**
 * Starts an asynchronous operation to update the users list
 */
ngOnInit(): void {
  this.getTodosFromServer();
}

}
