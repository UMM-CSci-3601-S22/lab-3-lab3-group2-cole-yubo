import { TodoListPage } from 'cypress/support/todo-list.po';


const page = new TodoListPage();

describe('Todo list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Find To Dos');
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for owner 'Fry'
    cy.get('#todo-owner-input').type('Fry');

    // All of the todos should have the owner filtering by, in this case 'Fry'
    page.getTodoListItems().each($item => {
      cy.wrap($item).find('.todo-list-owner').should('have.text', 'Fry');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoListItems().find('.todo-list-owner').each($item =>
      expect($item.text()).to.equal('Fry')
    );
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    // Filter for category 'homework'
    cy.get('#todo-category-input').type('homework');

    // All of the todos should have the category filtering by, in this case 'Fry'
    page.getTodoListItems().each($item => {
      cy.wrap($item).find('.todo-list-category').should('have.text', 'homework');
    });
  });

  it('Should type something in the "Body Contains" filter and check that it returned correct elements', () => {
    // Filter for category 'homework'
    cy.get('#todo-contains-input').type('esse');

    // All of the todos body should contain 'esse'
    page.getTodoListItems().find('.todo-list-body').each($item =>
      expect($item.text().toLowerCase()).to.contain('esse')
    );
  });

  it('Should click a todo item and go to the right URL', () => {
    page.getTodoListItems().first().then((todo) => {
      const firstTodoOwner = todo.find('.todo-list-owner').text();
      const firstTodoCategory = todo.find('.todo-list-category').text();

      // When a todo is clicked on, the first todo card is clicked, the URL should have a valid mongo ID
      page.clickTodoItem();

      // The URL should contain '/todos/' (note the ending slash) and '/todos/' should be followed by a mongo ID
      cy.url()
        .should('contain', '/todos/')
        .should('match', /.*\/todos\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the name and company should be correct
      cy.get('.todo-card-owner').first().should('have.text', firstTodoOwner);
      cy.get('.todo-card-category').first().should('have.text', firstTodoCategory);
    });
  });

});
