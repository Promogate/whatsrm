// src/core/usecases/contact/CreateContactUseCase.ts
import { CreateContact, CreateContactDTO } from '@/core/ports/usecases/contacts/CreateContact';
import { Contact } from '@core/domain/Contact';
import { ContactRepository } from '@core/ports/repositories/ContactRepository';
import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';

export class CreateContactUseCase implements CreateContact {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly customerRepository: CustomerRepository
  ) {}

  async execute(data: CreateContactDTO): Promise<Contact> {
    const customer = await this.customerRepository.findById(data.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const existingContact = await this.contactRepository.findByWhatsappId(data.whatsappId);
    if (existingContact) {
      throw new Error('Contact with this WhatsApp ID already exists');
    }

    const contact = Contact.create(data);

    await this.contactRepository.save(contact);

    return contact;
  }
}