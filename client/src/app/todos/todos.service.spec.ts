import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TodoService } from './todos.service';
import { ToDo } from './todo';

describe('TodosService', () => {

  // A small collection of test todos
  const testTodos: ToDo[] = [
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
  let todosService: TodoService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todosService = new TodoService(httpClient);
  });

  it('calls `api/todos` when `getTodos()` is called with no parameters', () => {
    // Assert that the todos we get from this call to getTodos()
    // should be our set of test todos. Because we're subscribing
    // to the result of getTodos(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testTodos) a few lines
    // down.
    todosService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(todosService.todoUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Check that the request had no query parameters.
    expect(req.request.params.keys().length).toBe(0);
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testTodos);
  });

  describe('Calling getTodos() with parameters correctly forms the HTTP request', () => {

    it('correctly calls api/todos with filter parameter \'status\'', () => {
      todosService.getTodos({ status: 'complete' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the status parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todosService.todoUrl) && request.params.has('status')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the status parameter was 'complete'
      expect(req.request.params.get('status')).toEqual('complete');

      req.flush(testTodos);
    });

    it('correctly calls api/todos with filter parameter \'owner\'', () => {

      todosService.getTodos({ owner: 'Blanche' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the owner parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todosService.todoUrl) && request.params.has('owner')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the owner parameter was ''
      expect(req.request.params.get('owner')).toEqual('Blanche');

      req.flush(testTodos);
    });

    it('correctly calls api/todos with filter parameter \'category\'', () => {

      todosService.getTodos({ category: 'homework' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the category parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todosService.todoUrl) && request.params.has('category')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the owner parameter was 'homework'
      expect(req.request.params.get('category')).toEqual('homework');

      req.flush(testTodos);
    });

    it('correctly calls api/todos with multiple filter parameters', () => {

      todosService.getTodos({ status: 'complete', owner: 'Blanche', category: 'category' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the parameters.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todosService.todoUrl)
          && request.params.has('status') && request.params.has('owner') && request.params.has('category')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the parameters are correct
      expect(req.request.params.get('status')).toEqual('complete');
      expect(req.request.params.get('owner')).toEqual('Blanche');
      expect(req.request.params.get('category')).toEqual('category');

      req.flush(testTodos);
    });
  });

  describe('getTodoById()', () => {
    it('calls api/todos/id with the correct ID', () => {
      // Picking a Todo "at random" from the set of Todos up at the top.
      const targetTodo: ToDo = testTodos[1];
      const targetId: string = targetTodo._id;

      todosService.getTodoById(targetId).subscribe(
        // Just confirms that getTodoById() doesn't modify the input Todo.
        todo => expect(todo).toBe(targetTodo)
      );

      const expectedUrl: string = todosService.todoUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });

  describe('Testing filterTodos()', () => {

    it('filters by owner', () => {
      const ownerName = 'r';
      const filteredTodos = todosService.filterTodos(testTodos, { owner: ownerName });
      // There should be two todos with an 'r' in the owner name.
      // owner: Fry
      expect(filteredTodos.length).toBe(2);
      // Every todo's owner name should contain an 'r'.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(ownerName)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by category', () => {
      const todoCategory = 'homework';
      const filteredTodos = todosService.filterTodos(testTodos, { category: todoCategory });
      // There should be one todo that has 'homework' its category.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo's category should contain 'homework'.
      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by if body contains a word', () => {
      const todoBodyWord = 'magna';
      const filteredTodos = todosService.filterTodos(testTodos, { contains: todoBodyWord });
      // There should be three todos that contain 'magna' in their body.
      expect(filteredTodos.length).toBe(3);
      // Every returned todo's body should contain 'magna'.
      filteredTodos.forEach(todo => {
        expect(todo.body.indexOf(todoBodyWord)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by owner, body and category', () => {
      const ownerName = 'r';
      const todoCategory = 'homework';
      const todoBodyWord = 'magna';
      const filters = { owner: ownerName, category: todoCategory, contains: todoBodyWord };
      const filteredTodos = todosService.filterTodos(testTodos, filters);
      // There should be just one todo with these properties.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo should have all of these properties.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(ownerName)).toBeGreaterThanOrEqual(0);
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
        expect(todo.body.indexOf(todoBodyWord)).toBeGreaterThanOrEqual(0);
      });
    });
  });

});
