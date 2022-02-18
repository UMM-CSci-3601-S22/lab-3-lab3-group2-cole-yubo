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
    // This happens when we call req.flush(testUsers) a few lines
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

  describe('Calling getUsers() with parameters correctly forms the HTTP request', () => {
    /*
     * We really don't care what `getUsers()` returns in the cases
     * where the filtering is happening on the server. Since all the
     * filtering is happening on the server, `getUsers()` is really
     * just a "pass through" that returns whatever it receives, without
     * any "post processing" or manipulation. So the tests in this
     * `describe` block all confirm that the HTTP request is properly formed
     * and sent out in the world, but don't _really_ care about
     * what `getUsers()` returns as long as it's what the HTTP
     * request returns.
     *
     * So in each of these tests, we'll keep it simple and have
     * the (mocked) HTTP request return the entire list `testUsers`
     * even though in "real life" we would expect the server to
     * return return a filtered subset of the users.
     */

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

      // Check that the owner parameter was ''
      expect(req.request.params.get('category')).toEqual('homework');

      req.flush(testTodos);
    });

    it('correctly calls api/users with multiple filter parameters', () => {

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
});
