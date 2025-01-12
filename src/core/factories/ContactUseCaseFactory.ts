import { ContactRepository } from '@core/ports/repositories/ContactRepository';
import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';
import { CreateContactUseCase } from '@core/usecases/contact/CreateContactUseCase';
import { UpdateContactUseCase } from '@core/usecases/contact/UpdateContactUseCase';
import { ManageContactTagsUseCase } from '@core/usecases/contact/ManageCustomerTagsUseCase';
import { FindContactsUseCase } from '@core/usecases/contact/FindContactUseCase';

export class ContactUseCaseFactory {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly customerRepository: CustomerRepository
  ) {}

  createCreateContactUseCase(): CreateContactUseCase {
    return new CreateContactUseCase(this.contactRepository, this.customerRepository);
  }

  createUpdateContactUseCase(): UpdateContactUseCase {
    return new UpdateContactUseCase(this.contactRepository);
  }

  createManageContactTagsUseCase(): ManageContactTagsUseCase {
    return new ManageContactTagsUseCase(this.contactRepository);
  }

  createFindContactsUseCase(): FindContactsUseCase {
    return new FindContactsUseCase(this.contactRepository);
  }
}