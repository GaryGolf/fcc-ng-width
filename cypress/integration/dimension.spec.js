context('General', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  });

  it('input could have auto value', () => {
    cy.get('.input-group .form-control', { timeout: 2000 })
      .clear()
      .focus()
      .type('auto')
      .should('have.value', 'auto')
  });

  it('input could have 100% value', () => {
    cy.get('.input-group .form-control', { timeout: 2000 })
      .clear()
      .focus()
      .type('100%')
      .get('#control', { timeout: 2000 })
      .focus()
      .should('have.value', '100%')
  });

  it('input could drop down mwnu', () => {
    cy.get('.dropdown', { timeout: 2000 })
      .click()
      .should('have.class', 'open')
  });

  it('select unit change value', () => {
    cy.get('.input-group .form-control', { timeout: 2000 })
      .clear()
      .focus()
      .type('2%')
      .get('.dropdown', { timeout: 2000 })
      .click()
      .get('[data-unit="rem"]', { timeout: 2000 })
      .click()
      .get('#control', { timeout: 2000 })
      .focus()
      .should('have.value', '2rem')
  });

})
