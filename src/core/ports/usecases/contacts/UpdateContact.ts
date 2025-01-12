import { Contact } from "@/core/domain/Contact";

export interface UpdateContactDTO {
  id: string;
  name?: string;
  phone?: string;
  type?: 'lead' | 'client' | 'prospect';
  status?: 'active' | 'inactive' | 'negotiating';
}

export interface UpdateContact {
  execute(data: UpdateContactDTO): Promise<Contact>;
}