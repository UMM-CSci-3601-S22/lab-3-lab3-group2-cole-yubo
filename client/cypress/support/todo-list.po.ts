export class TodoListPage {
  navigateTo() {
    return cy.visit('/todos');
  }

  getUrl() {
    return cy.url();
  }

  /**
   * Gets the title of the app when visiting the `/todos` page.
   *
   * @returns the value of the element with the ID `.todos-list-title`
   */
  getTodoTitle() {
    return cy.get('.todos-list-title');
  }

  /**
   * Get all the `.todo-nav-list` DOM elements. This will
   * be empty if we're using the card view of the todos.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `.todo-list-item` DOM elements.
   */
  getTodoListItems() {
    return cy.get('.todo-nav-list .todos-list-item');
  }

  /**
   * Clicks the "view profile" button for the given todo card.
   * Requires being in the "card" view.
   *
   * @param listItem The todo item
   */
   clickTodoItem() {
    return cy.get('.todo-nav-list .todos-list-item').eq(0).click();
  }

}
