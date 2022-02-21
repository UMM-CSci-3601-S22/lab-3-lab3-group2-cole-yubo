import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { TodosListComponent } from './todos-list.component';
import { TodoService } from '../todos.service';
import { ToDo } from '../todo';
import { MockTodoService } from 'src/testing/todo.service.mock';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];


// The `TodosListComponent` being tested
let todoList: TodosListComponent;

// This constructs the `todoList` (declared
// above) that will be used throughout the tests.
// This is called in a `beforeEach()` in each of the
// `describe()` sections below.
async function constructTodoList() {
  // Compile all the components in the test bed
  // so that everything's ready to go.
  await TestBed.compileComponents();
  // Create a fixture of the TodosListComponent. That
  // allows us to get an instance of the component
  // (todoList, below) that we can control in
  // the tests.
  const fixture = TestBed.createComponent(TodosListComponent);
  todoList = fixture.componentInstance;
  // Tells Angular to sync the data bindings between
  // the model and the DOM. This ensures, e.g., that the
  // `todoList` component actually requests the list
  // of users from the `MockTodoService` so that it's
  // up to date before we start running tests on it.
  fixture.detectChanges();
}

describe('TodosListComponent', () => {
  // Set up the `TestBed` so that it uses
  // a `MockTodoService` in place of the real `TodoService`
  // for the purposes of the testing. We also have to include
  // the relevant imports and declarations so that the tests
  // can find all the necessary parts.
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [TodosListComponent],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    });
  });

  // Construct the `todoList` used for the testing in the `it` statements
  // below.
  beforeEach(waitForAsync(constructTodoList));

  it('contains all the todos', () => {
    expect(todoList.serverFilteredTodos.length).toBe(4);
  });

  it('contains a owner named "Blanche"', () => {
    expect(todoList.serverFilteredTodos.some((todo: ToDo) => todo.owner === 'Blanche')).toBe(true);
  });

  it('doesn\'t contain a user named "FooBar"', () => {
    expect(todoList.serverFilteredTodos.some((todo: ToDo) => todo.owner === 'FooBar')).toBe(false);
  });

  it('has one todo with category software design', () => {
    expect(todoList.serverFilteredTodos.filter((todo: ToDo) => todo.category === 'software design').length).toBe(2);
  });
});

/*
 * This test is a little odd, but illustrates how we can use stubs
 * to create mock objects (a service in this case) that be used for
 * testing. Here we set up the mock TodoService (userServiceStub) so that
 * _always_ fails (throws an exception) when you request a set of users.
 *
 * So this doesn't really test anything meaningful in the context of our
 * code (I certainly wouldn't copy it), but it does illustrate some nice
 * testing tools. Hopefully it's useful as an example in that regard.
 */
describe('Misbehaving Todo List', () => {

  let todoServiceStub: {
    getTodos: () => Observable<ToDo[]>;
    getTodosFiltered: () => Observable<ToDo[]>;
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoServiceStub = {
      getTodos: () => new Observable(observer => {
        observer.error('getTodos() Observer generates an error');
      }),
      getTodosFiltered: () => new Observable(observer => {
        observer.error('getTodosFiltered() Observer generates an error');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [TodosListComponent],
      // providers:    [ TodoService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: TodoService, useValue: todoServiceStub }]
    });
  });

  // Construct the `todoList` used for the testing in the `it` statement
  // below.
  beforeEach(waitForAsync(constructTodoList));

  it('fails to load users if we do not set up a UserListService', () => {
    // Since calling both getUsers() and getUsersFiltered() return
    // Observables that then throw exceptions, we don't expect the component
    // to be able to get a list of users, and serverFilteredUsers should
    // be undefined.
    expect(todoList.serverFilteredTodos).toBeUndefined();
  });
});
