context('General', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  });

  it('input could have auto value', () => {
    // https://on.cypress.io/type
    cy.get('.input-group .form-control')
      .clear()
      .type('auto')
      .should('have.value', 'auto')
  });

})