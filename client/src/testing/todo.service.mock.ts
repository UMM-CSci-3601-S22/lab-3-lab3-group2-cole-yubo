import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ToDo, ToDoStatus } from 'src/app/todos/todo';
import { TodoService } from 'src/app/todos/todos.service';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service.
 */
// It needs to be `Injectable` since that's how services are typically
// provided to components.
@Injectable()
export class MockTodoService extends TodoService {
  // A small collection of test todos
  static testTodos: ToDo[] = [
    {
      _id: '58895985a22c04e761776d54',
      owner: 'Blanche',
      status: 'incomplete',
      body: 'In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.',
      category: 'software design'
    },
    {
      _id: '58895985c1849992336c219b',
      owner: 'Fry',
      status: 'incomplete',
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
      category: 'video games'
    },
    {
      _id: '58895985ae3b752b124e7663',
      owner: 'Fry',
      status: 'complete',
      body: 'Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.',
      category: 'homework'
    },
    {
      _id: '58895985186754887e0381f5',
      owner: 'Blanche',
      status: 'complete',
      body: 'Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur \
    incididunt cupidatat laboris commodo veniam do ut sint.',
      category: 'software design'
    },
  ];

  constructor() {
    super(null);
  }

  getTodos(filters: { owner?: string; status?: ToDoStatus; category?: string }): Observable<ToDo[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test todos regardless of what
    // filters are passed in.
    //
    // The `of()` function converts a regular object or value into an
    // `Observable` of that object or value.
    return of(MockTodoService.testTodos);
  }

  getTodosById(id: string): Observable<ToDo> {
    // If the specified ID is for the first test todo,
    // return that todo, otherwise return `null` so
    // we can test illegal todo requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }

}
