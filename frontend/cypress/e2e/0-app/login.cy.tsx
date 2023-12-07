describe('Test Login Page', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display login page', () => {
        cy.get('[data-cy="login-page-title"]').should('be.visible');
    });

    it('should display login form', () => {
        cy.get('[data-cy="login-form"]').should('be.visible');
    });

    it('should be able to login', () => {
        cy.intercept('POST', '/api/auth/callback/credentials', {
            statusCode: 200,
            body: {
                url: '/',
            },
        }).as('login');

        cy.get('[data-cy="login-form"]').within(() => {
            cy.get('[data-cy="login-email-input"]').type('admin@admin.com');
            cy.get('[data-cy="login-password-input"]').type('admin');
            cy.get('[data-cy="login-submit-button"]').click();

            cy.wait('@login').then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        });
    });
});
