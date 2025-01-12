import { FindContacts, FindContactsFilters } from '@core/ports/usecases/contacts/FindContacts';
import { Contact } from '@core/domain/Contact';
import { ContactRepository } from '@core/ports/repositories/ContactRepository';

export class FindContactsUseCase implements FindContacts {
  constructor(
    private readonly contactRepository: ContactRepository
  ) {}

  async findById(id: string): Promise<Contact | null> {
    return this.contactRepository.findById(id);
  }

  async findByCustomerId(customerId: string): Promise<Contact[]> {
    return this.contactRepository.findByCustomerId(customerId);
  }

  async findWithFilters(filters: FindContactsFilters): Promise<Contact[]> {
    const contacts = await this.contactRepository.findByCustomerId(filters.customerId || '');
    
    return contacts.filter(contact => {
      if (filters.type && contact.getType() !== filters.type) {
        return false;
      }
      
      if (filters.status && contact.getStatus() !== filters.status) {
        return false;
      }
      
      if (filters.tags && filters.tags.length > 0) {
        const contactTags = contact.getTags();
        return filters.tags.every(tag => contactTags.includes(tag));
      }
      
      return true;
    });
  }
}