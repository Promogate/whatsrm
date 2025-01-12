import { Contact } from "@/core/domain";

export interface FindContactsFilters {
  customerId?: string;
  type?: 'lead' | 'client' | 'prospect';
  status?: 'active' | 'inactive' | 'negotiating';
  tags?: string[];
}

export interface FindContacts {
  findById(id: string): Promise<Contact | null>;
  findByCustomerId(customerId: string): Promise<Contact[]>;
  findWithFilters(filters: FindContactsFilters): Promise<Contact[]>;
}