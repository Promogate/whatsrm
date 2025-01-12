import { Contact } from "@/core/domain";

export interface CreateContactDTO {
  whatsappId: string;
  name: string;
  phone: string;
  type: 'lead' | 'client' | 'prospect';
  tags?: string[];
  customerId: string;
}

export interface CreateContact {
  execute(data: CreateContactDTO): Promise<Contact>;
}