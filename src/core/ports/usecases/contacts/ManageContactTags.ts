import { Contact } from "@/core/domain";

export interface ManageContactTags {
  addTag(contactId: string, tag: string): Promise<Contact>;
  removeTag(contactId: string, tag: string): Promise<Contact>;
}