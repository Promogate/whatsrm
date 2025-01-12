// src/tests/application/controllers/ContactController.test.ts
import { ContactController } from '@/application/controllers/ContactController';
import { MockHttpServer } from '@/tests/mocks/MockHttpServer';
import { MockAuthMiddleware } from '@/tests/mocks/MockAuthMiddleware';
import sinon from 'sinon';

describe('ContactController', () => {
  let httpServer: MockHttpServer;
  let authMiddleware: MockAuthMiddleware;
  let createContactUseCase: any;
  let updateContactUseCase: any;
  let manageContactTagsUseCase: any;
  let findContactsUseCase: any;
  let controller: ContactController;

  beforeEach(() => {
    httpServer = new MockHttpServer();
    authMiddleware = new MockAuthMiddleware();
    
    createContactUseCase = {
      execute: sinon.stub()
    };
    
    updateContactUseCase = {
      execute: sinon.stub()
    };
    
    manageContactTagsUseCase = {
      addTag: sinon.stub(),
      removeTag: sinon.stub()
    };
    
    findContactsUseCase = {
      findById: sinon.stub(),
      findByCustomerId: sinon.stub(),
      findWithFilters: sinon.stub()
    };

    controller = new ContactController(
      httpServer,
      authMiddleware,
      createContactUseCase,
      updateContactUseCase,
      manageContactTagsUseCase,
      findContactsUseCase
    );
  });

  describe('Route Setup', () => {
    it('should setup all routes with auth middleware', () => {
      expect(httpServer.routes).toHaveLength(7);
      httpServer.routes.forEach(route => {
        expect(route.middleware).toContain(authMiddleware);
      });
    });
  });

  describe('createContact', () => {
    it('should create a contact successfully', async () => {
      const mockContactData = {
        id: 'contact-id',
        name: 'John Doe',
        toJSON: () => ({
          id: 'contact-id',
          name: 'John Doe'
        })
      };

      createContactUseCase.execute.resolves(mockContactData);

      const createContactRoute = httpServer.routes.find(
        r => r.method === 'post' && r.route === '/contacts'
      );

      const response = await createContactRoute?.handler({
        body: {
          name: 'John Doe',
          whatsappId: '123456',
          phone: '+1234567890',
          customerId: 'customer-id'
        },
        user: {
          email: 'user-email',
          userId: 'customer-id'
        },
        params: {},
        query: {},
        headers: {}
      });

      expect(response?.statusCode).toBe(201);
      expect(response?.body).toEqual(mockContactData.toJSON());
      sinon.assert.calledOnce(createContactUseCase.execute);
    });

    it('should handle creation errors', async () => {
      createContactUseCase.execute.rejects(new Error('Validation error'));

      const createContactRoute = httpServer.routes.find(
        r => r.method === 'post' && r.route === '/contacts'
      );

      const response = await createContactRoute?.handler({
        body: {},
        user: { email: 'user-email', userId: 'customer-id' },
        params: {},
        query: {},
        headers: {}
      });

      expect(response?.statusCode).toBe(400);
      expect(response?.body).toEqual({ error: 'Validation error' });
    });
  });

  describe('updateContact', () => {
    it('should update a contact successfully', async () => {
      const mockContactData = {
        id: 'contact-id',
        name: 'John Doe Updated',
        toJSON: () => ({
          id: 'contact-id',
          name: 'John Doe Updated'
        })
      };

      updateContactUseCase.execute.resolves(mockContactData);

      const updateContactRoute = httpServer.routes.find(
        r => r.method === 'put' && r.route === '/contacts/:id'
      );

      const response = await updateContactRoute?.handler({
        body: { name: 'John Doe Updated' },
        params: { id: 'contact-id' },
        user: { email: 'user-email', userId: 'customer-id' },
        query: {},
        headers: {}
      });

      expect(response?.statusCode).toBe(200);
      expect(response?.body).toEqual(mockContactData.toJSON());
    });
  });

  describe('findContacts', () => {
    it('should find contacts with filters', async () => {
      const mockContacts = [
        {
          id: 'contact-1',
          toJSON: () => ({ id: 'contact-1', name: 'Contact 1' })
        },
        {
          id: 'contact-2',
          toJSON: () => ({ id: 'contact-2', name: 'Contact 2' })
        }
      ];

      findContactsUseCase.findWithFilters.resolves(mockContacts);

      const findContactsRoute = httpServer.routes.find(
        r => r.method === 'get' && r.route === '/contacts'
      );

      const response = await findContactsRoute?.handler({
        query: { type: 'lead', status: 'active' },
        user: { email: 'user-email', userId: 'customer-id' },
        body: {},
        params: {},
        headers: {}
      });

      expect(response?.statusCode).toBe(200);
      expect(response?.body).toEqual(mockContacts.map(contact => contact.toJSON()));

      const expectedFilters = {
        type: 'lead',
        status: 'active',
        tags: undefined
      };

      sinon.assert.calledWithMatch(findContactsUseCase.findWithFilters, expectedFilters);
    });
  });

  describe('findContactsByCustomer', () => {
    it('should deny access when userId doesnt match customerId', async () => {
      const findByCustomerRoute = httpServer.routes.find(
        r => r.method === 'get' && r.route === '/customers/:customerId/contacts'
      );

      const response = await findByCustomerRoute?.handler({
        params: { customerId: 'different-id' },
        user: { 
          userId: 'user-id',
          email: 'test@example.com'
        },
        query: {},
        body: {},
        headers: {}
      });

      expect(response?.statusCode).toBe(403);
      expect(response?.body).toEqual({ error: 'Unauthorized access' });
      sinon.assert.notCalled(findContactsUseCase.findByCustomerId);
    });

    it('should return 404 when no contacts are found', async () => {
      findContactsUseCase.findByCustomerId.resolves(null);

      const findByCustomerRoute = httpServer.routes.find(
        r => r.method === 'get' && r.route === '/customers/:customerId/contacts'
      );

      const response = await findByCustomerRoute?.handler({
        params: { customerId: 'user-id' },
        user: { 
          userId: 'user-id',
          email: 'test@example.com'
        },
        query: {},
        body: {},
        headers: {}
      });

      expect(response?.statusCode).toBe(404);
      expect(response?.body).toEqual({ error: 'No contacts found' });
    });

    it('should return contacts when userId matches customerId', async () => {
      const mockContacts = [
        {
          id: 'contact-1',
          toJSON: () => ({ id: 'contact-1', name: 'Contact 1' })
        }
      ];

      findContactsUseCase.findByCustomerId.resolves(mockContacts);

      const findByCustomerRoute = httpServer.routes.find(
        r => r.method === 'get' && r.route === '/customers/:customerId/contacts'
      );

      const response = await findByCustomerRoute?.handler({
        params: { customerId: 'user-id' },
        user: { 
          userId: 'user-id',
          email: 'test@example.com'
        },
        query: {},
        body: {},
        headers: {}
      });

      expect(response?.statusCode).toBe(200);
      expect(response?.body).toEqual(mockContacts.map(contact => contact.toJSON()));
      sinon.assert.calledWith(findContactsUseCase.findByCustomerId, 'user-id');
    });
  });

  describe('manageContactTags', () => {
    it('should add a tag successfully', async () => {
      const mockContactData = {
        id: 'contact-id',
        toJSON: () => ({
          id: 'contact-id',
          tags: ['new-tag']
        })
      };

      manageContactTagsUseCase.addTag.resolves(mockContactData);

      const addTagRoute = httpServer.routes.find(
        r => r.method === 'post' && r.route === '/contacts/:id/tags'
      );

      const response = await addTagRoute?.handler({
        params: { id: 'contact-id' },
        body: { tag: 'new-tag' },
        user: { email: 'user-email', userId: 'customer-id' },
        query: {},
        headers: {}
      });

      expect(response?.statusCode).toBe(200);
      expect(response?.body).toEqual(mockContactData.toJSON());
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});