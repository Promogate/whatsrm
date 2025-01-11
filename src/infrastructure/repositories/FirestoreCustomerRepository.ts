import { CustomerRepository } from '@core/ports/repositories/CustomerRepository';
import { Customer } from '@core/domain/Customer';
import { firestore } from 'firebase-admin';

export class FirestoreCustomerRepository implements CustomerRepository {
  constructor(private readonly db: firestore.Firestore) { }

  async save(customer: Customer): Promise<void> {
    const customerRef = this.db
      .collection('customers')
      .doc(customer.getId());

    await customerRef.set(customer.toJSON());
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const querySnapshot = await this.db
      .collection('customers')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    const customerData = querySnapshot.docs[0].data();
    return Customer.create({
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone
    });
  }
}