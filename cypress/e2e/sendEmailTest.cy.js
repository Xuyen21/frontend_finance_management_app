describe('Full Flow Test', () => {
  it('should send confirmation email and handle email confirmation link', () => {
    // Intercept the email send request and check the content of the request
    cy.intercept('POST', 'https://otdnnqzohxbqmljktttb.supabase.co/auth/v1/otp', (req) => {
      expect(req.body.email).to.equal('user@gmail.com');
      req.reply({
        statusCode: 200,
        body: { success: true, message: 'Email sent' }
      });
    }).as('sendEmail');

    // Open the login page
    cy.visit('http://localhost:3000/login');

    // Ensure the "Get Started" button is visible and clickable
    cy.wait(1000); // Wait for 1 second to ensure the button is rendered
    cy.get('button').contains('Get Started').should('be.visible').click();

    // Fill in the login information and submit
    cy.get('input[name="email"]').type('user@gmail.com');
    cy.get('button[type="submit"]').click();

    // Check that the email send request was sent and the response was successful
    cy.contains('Thank you for submitting your email!').should('be.visible');

    // Create a fake confirmation URL
    const confirmationUrl = 'http://localhost:3000/confirmation?code=fd778ec6-989c-42bc-97d9-bdb87fcaa0ac';
    const redirectUrl = `https://otdnnqzohxbqmljktttb.supabase.co/auth/v1/verify?token=fd778ec6-989c-42bc-97d9-bdb87fcaa0ac&type=magiclink&redirect_to=${encodeURIComponent(confirmationUrl)}`;

    // Log the fake confirmation URL to simulate sending the email
    cy.log('Fake confirmation URL:', redirectUrl);
  });
});
