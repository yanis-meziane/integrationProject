describe('BoxLetter Application E2E Tests', () => {
  beforeEach(() => {
    // Visiter la page d'accueil avant chaque test
    cy.visit('/');
  });

  it('devrait charger la page d\'accueil', () => {
    cy.contains('Bienvenue sur BoxLetter').should('be.visible');
    cy.contains('connectez-vous').should('be.visible');
    cy.contains('inscrivez-vous').should('be.visible');
  });

  it('devrait naviguer vers la page de connexion', () => {
    cy.contains('connectez-vous').click();
    cy.url().should('include', '/login');
    cy.contains('Connexion').should('be.visible');
  });

  it('devrait naviguer vers la page d\'inscription', () => {
    cy.contains('inscrivez-vous').click();
    cy.url().should('include', '/register');
    cy.contains('Inscription').should('be.visible');
  });

  it('devrait se connecter en tant qu\'utilisateur', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('jean.dupont@gmail.com');
    cy.get('input[name="password"]').type('Password123@!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/homepage');
    cy.contains('Bienvenue Jean').should('be.visible');
  });

  it('devrait afficher les films sur la homepage', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('jean.dupont@gmail.com');
    cy.get('input[name="password"]').type('Password123@!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/homepage');
    cy.contains('Inception').should('be.visible');
    cy.contains('The Matrix').should('be.visible');
  });

  it('devrait permettre de noter un film', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('jean.dupont@gmail.com');
    cy.get('input[name="password"]').type('Password123@!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/homepage');
    
    // Cliquer sur la première étoile du premier film
    cy.get('span').contains('★').first().click();
    
    cy.contains('Note enregistrée').should('be.visible');
  });

  it('devrait se connecter en tant qu\'admin', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('admin@boxletter.com');
    cy.get('input[name="password"]').type('AdminPassword123@!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/admin');
    cy.contains('Panneau d\'administration').should('be.visible');
  });

  it('devrait afficher le formulaire d\'ajout de film pour l\'admin', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('admin@boxletter.com');
    cy.get('input[name="password"]').type('AdminPassword123@!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/admin');
    cy.contains('Ajouter un nouveau film').should('be.visible');
    cy.get('input[name="title"]').should('be.visible');
    cy.get('input[name="director"]').should('be.visible');
  });

  it('devrait afficher une erreur avec des identifiants incorrects', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('wrong@email.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Email ou mot de passe incorrect').should('be.visible');
  });
});