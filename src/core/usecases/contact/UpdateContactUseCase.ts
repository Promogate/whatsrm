// src/core/usecases/contact/UpdateContactUseCase.ts
import { UpdateContact, UpdateContactDTO } from '@/core/ports/usecases/contacts/UpdateContact';
import { Contact } from '@core/domain/Contact';
import { ContactRepository } from '@core/ports/repositories/ContactRepository';

export class UpdateContactUseCase implements UpdateContact {
  constructor(
    private readonly contactRepository: ContactRepository
  ) {}

  async execute(data: UpdateContactDTO): Promise<Contact> {
    const contact = await this.contactRepository.findById(data.id);
    if (!contact) {
      throw new Error('Contact not found');
    }

    if (data.name) {
      contact.updateName(data.name);
    }

    if (data.phone) {
      contact.updatePhone(data.phone);
    }

    if (data.type) {
      contact.updateType(data.type);
    }

    if (data.status) {
      contact.updateStatus(data.status);
    }

    await this.contactRepository.save(contact);

    return contact;
  }
}