import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  getDoc,
  DocumentData
} from 'firebase/firestore';
import { ContactRepository } from '@core/ports/repositories/ContactRepository';
import { Contact } from '@core/domain/Contact';
import { db } from '@infrastructure/config/Firebase';

export class FirestoreContactRepository implements ContactRepository {
  private readonly collectionName = 'contacts';

  async save(contact: Contact): Promise<void> {
    try {
      const contactsRef = collection(db, this.collectionName);
      const contactDoc = doc(contactsRef, contact.getId());
      
      await setDoc(contactDoc, contact.toJSON());
    } catch (error: any) {
      console.error('Error saving contact:', error);
      throw new Error(`Failed to save contact: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Contact | null> {
    try {
      const contactRef = doc(collection(db, this.collectionName), id);
      const contactDoc = await getDoc(contactRef);

      if (!contactDoc.exists()) {
        return null;
      }

      return this.convertToContact(contactDoc.data(), contactDoc.id);
    } catch (error: any) {
      console.error('Error finding contact by ID:', error);
      throw new Error(`Failed to find contact: ${error.message}`);
    }
  }

  async findByCustomerId(customerId: string): Promise<Contact[]> {
    try {
      const contactsRef = collection(db, this.collectionName);
      const q = query(contactsRef, where('customerId', '==', customerId));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => 
        this.convertToContact(doc.data(), doc.id)
      );
    } catch (error: any) {
      console.error('Error finding contacts by customer ID:', error);
      throw new Error(`Failed to find contacts: ${error.message}`);
    }
  }

  async findByPhone(phone: string): Promise<Contact | null> {
    try {
      const contactsRef = collection(db, this.collectionName);
      const q = query(contactsRef, where('phone', '==', phone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return this.convertToContact(doc.data(), doc.id);
    } catch (error: any) {
      console.error('Error finding contact by phone:', error);
      throw new Error(`Failed to find contact: ${error.message}`);
    }
  }

  async findByWhatsappId(whatsappId: string): Promise<Contact | null> {
    try {
      const contactsRef = collection(db, this.collectionName);
      const q = query(contactsRef, where('whatsappId', '==', whatsappId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return this.convertToContact(doc.data(), doc.id);
    } catch (error: any) {
      console.error('Error finding contact by WhatsApp ID:', error);
      throw new Error(`Failed to find contact: ${error.message}`);
    }
  }

  private convertToContact(data: DocumentData, id: string): Contact {
    return Contact.reconstitute({
      id,
      whatsappId: data.whatsappId,
      name: data.name,
      phone: data.phone,
      type: data.type,
      tags: data.tags,
      status: data.status,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      customerId: data.customerId
    });
  }
}