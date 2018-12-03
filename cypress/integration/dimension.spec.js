context('General', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  });

  it('input could have auto value', () => {
    // https://on.cypress.io/type
    cy.get('.input-group .form-control', { timeout: 2000 })
      .clear()
      .focus()
      .type('auto')
      .should('have.value', 'auto')
  });

  it('input could drop down mwnu', () => {
    // https://on.cypress.io/type
    cy.get('.dropdown', { timeout: 2000 })
      .click()
      .should('have.class', 'open')
  });

})
