import { Contact } from '@core/domain/Contact';

export interface ContactRepository {
  save(contact: Contact): Promise<void>;
  findById(id: string): Promise<Contact | null>;
  findByCustomerId(customerId: string): Promise<Contact[]>;
  findByPhone(phone: string): Promise<Contact | null>;
  findByWhatsappId(whatsappId: string): Promise<Contact | null>;
}