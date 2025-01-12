import { ManageContactTags } from '@/core/ports/usecases/contacts/ManageContactTags';
import { Contact } from '@core/domain/Contact';
import { ContactRepository } from '@core/ports/repositories/ContactRepository';

export class ManageContactTagsUseCase implements ManageContactTags {
  constructor(
    private readonly contactRepository: ContactRepository
  ) {}

  async addTag(contactId: string, tag: string): Promise<Contact> {
    const contact = await this.contactRepository.findById(contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }

    contact.addTag(tag);
    await this.contactRepository.save(contact);

    return contact;
  }

  async removeTag(contactId: string, tag: string): Promise<Contact> {
    const contact = await this.contactRepository.findById(contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }

    contact.removeTag(tag);
    await this.contactRepository.save(contact);

    return contact;
  }
}