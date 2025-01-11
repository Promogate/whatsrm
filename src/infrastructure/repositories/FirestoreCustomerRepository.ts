import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  DocumentData,
  Timestamp
} from 'firebase/firestore';
import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';
import { Customer } from '@core/domain/Customer';
import { db } from '@infrastructure/config/Firebase';

export class FirestoreCustomerRepository implements CustomerRepository {
  private readonly collectionName = 'customers';

  async save(customer: Customer): Promise<void> {
    try {
      const customersRef = collection(db, this.collectionName);
      const customerDoc = doc(customersRef, customer.getId());

      await setDoc(customerDoc, customer.toJSON(), { merge: true });
    } catch (error) {
      console.error('Error saving customer:', error);
      throw new Error('Failed to save customer');
    }
  }

  async findByEmail(email: string): Promise<Customer | null> {
    try {
      const customersRef = collection(db, this.collectionName);
      const q = query(customersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return Customer.reconstitute({
        id: doc.id,
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || null,
        createdAt: this.convertTimestampToDate(data.createdAt),
        updatedAt: this.convertTimestampToDate(data.updatedAt)
      });

    } catch (error) {
      console.error('Error finding customer by email:', error);
      throw new Error('Failed to find customer');
    }
  }

  private convertTimestampToDate(timestamp: Timestamp | Date): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  }

  private convertToCustomer(data: DocumentData, id: string): Customer {
    return Customer.reconstitute({
      id: id,
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || null,
      createdAt: this.convertTimestampToDate(data.createdAt),
      updatedAt: this.convertTimestampToDate(data.updatedAt)
    });
  }
}