import { HttpServer, HttpRequest, HttpResponse, HttpMiddleware, AuthenticatedRequest } from '@core/ports/http/HttpServer';
import { CreateContact } from '@core/ports/usecases/contacts/CreateContact';
import { UpdateContact } from '@core/ports/usecases/contacts/UpdateContact';
import { ManageContactTags } from '@core/ports/usecases/contacts/ManageContactTags';
import { FindContacts } from '@core/ports/usecases/contacts/FindContacts';

export class ContactController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly authMiddleware: HttpMiddleware,
    private readonly createContactUseCase: CreateContact,
    private readonly updateContactUseCase: UpdateContact,
    private readonly manageContactTagsUseCase: ManageContactTags,
    private readonly findContactsUseCase: FindContacts,
  ) {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    const middlewares = [this.authMiddleware];
    this.httpServer.on('/contacts', 'post', this.createContact.bind(this), middlewares);
    this.httpServer.on('/contacts/:id', 'put', this.updateContact.bind(this), middlewares);
    this.httpServer.on('/contacts/:id/tags', 'post', this.addTag.bind(this), middlewares);
    this.httpServer.on('/contacts/:id/tags/:tag', 'delete', this.removeTag.bind(this), middlewares);
    this.httpServer.on('/contacts', 'get', this.findContacts.bind(this), middlewares);
    this.httpServer.on('/contacts/:id', 'get', this.findContactById.bind(this), middlewares);
    this.httpServer.on('/customers/:customerId/contacts', 'get', this.findContactsByCustomer.bind(this), middlewares);
  }

  private async createContact(request: HttpRequest): Promise<HttpResponse> {
    try {
      const contact = await this.createContactUseCase.execute(request.body);

      return {
        statusCode: 201,
        body: contact.toJSON()
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { error: error.message }
      };
    }
  }

  private async updateContact(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;
      const contact = await this.updateContactUseCase.execute({
        id,
        ...request.body
      });

      return {
        statusCode: 200,
        body: contact.toJSON()
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { error: error.message }
      };
    }
  }

  private async addTag(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;
      const { tag } = request.body;

      const contact = await this.manageContactTagsUseCase.addTag(id, tag);

      return {
        statusCode: 200,
        body: contact.toJSON()
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { error: error.message }
      };
    }
  }

  private async removeTag(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id, tag } = request.params;

      const contact = await this.manageContactTagsUseCase.removeTag(id, tag);

      return {
        statusCode: 200,
        body: contact.toJSON()
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { error: error.message }
      };
    }
  }

  private async findContacts(request: HttpRequest): Promise<HttpResponse> {
    try {
      const filters = {
        type: request.query.type as any,
        status: request.query.status as any,
        tags: request.query.tags ? (request.query.tags as string).split(',') : undefined
      };

      const contacts = await this.findContactsUseCase.findWithFilters(filters);

      return {
        statusCode: 200,
        body: contacts.map(contact => contact.toJSON())
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { error: error.message }
      };
    }
  }

  private async findContactById(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;
      const contact = await this.findContactsUseCase.findById(id);

      if (!contact) {
        return {
          statusCode: 404,
          body: { error: 'Contact not found' }
        };
      }

      return {
        statusCode: 200,
        body: contact.toJSON()
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { error: error.message }
      };
    }
  }

  private async findContactsByCustomer(request: AuthenticatedRequest): Promise<HttpResponse> {
    try {
      const { customerId } = request.params;

      if (customerId !== request.user?.userId) {
        return {
          statusCode: 403,
          body: { error: 'Unauthorized access' }
        };
      }

      const contacts = await this.findContactsUseCase.findByCustomerId(customerId);

      if (!contacts) {
        return {
          statusCode: 404,
          body: { error: 'No contacts found' }
        };
      }

      return {
        statusCode: 200,
        body: contacts.map(contact => contact.toJSON())
      };
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
      return {
        statusCode,
        body: { error: error.message }
      };
    }
  }
}