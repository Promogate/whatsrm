import { firestore } from "firebase-admin";
import { MessageBroker } from "@/core/ports/messaging/MessageBroker";
import { CreateCustomer } from "@/core/ports/usecases/CreateCustomer";
import { FirestoreCustomerRepository } from "@infrastructure/repositories/FirestoreCustomerRepository";
import { CreateCustomerUseCase } from "@/core/usecases/CreateCustomerUseCase";

export class CreateCustomerUseCaseFactory {
  static create(db: firestore.Firestore, messageBroker: MessageBroker): CreateCustomer {
    const repository = new FirestoreCustomerRepository(db);
    return new CreateCustomerUseCase(repository, messageBroker);
  }
}