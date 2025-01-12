import { CreateContactUseCase } from '@core/usecases/contact/CreateContactUseCase';
import { Contact } from '@core/domain/Contact';
import sinon from 'sinon';

describe('CreateContactUseCase', () => {
  let contactRepository: any;
  let customerRepository: any;
  let createContactUseCase: CreateContactUseCase;

  beforeEach(() => {
    contactRepository = {
      save: sinon.stub(),
      findByWhatsappId: sinon.stub()
    };

    customerRepository = {
      findById: sinon.stub()
    };

    createContactUseCase = new CreateContactUseCase(
      contactRepository,
      customerRepository
    );
  });

  it('should create a contact when all data is valid', async () => {
    const contactData = {
      name: 'John Doe',
      whatsappId: '123456',
      phone: '+1234567890',
      type: 'lead' as const,
      customerId: 'customer-id'
    };

    customerRepository.findById.resolves({ id: 'customer-id' });
    contactRepository.findByWhatsappId.resolves(null);
    contactRepository.save.resolves();
    
    const result = await createContactUseCase.execute(contactData);

    expect(result).toBeInstanceOf(Contact);
    expect(result.getName()).toBe(contactData.name);
    sinon.assert.calledOnce(contactRepository.save);
  });

  it('should throw error when customer does not exist', async () => {
    customerRepository.findById.resolves(null);

    await expect(createContactUseCase.execute({
      name: 'John Doe',
      whatsappId: '123456',
      phone: '+1234567890',
      type: 'lead',
      customerId: 'invalid-id'
    })).rejects.toThrow('Customer not found');

    sinon.assert.notCalled(contactRepository.save);
  });

  it('should throw error when whatsappId already exists', async () => {
    customerRepository.findById.resolves({ id: 'customer-id' });
    contactRepository.findByWhatsappId.resolves({ id: 'existing-id' });

    await expect(createContactUseCase.execute({
      name: 'John Doe',
      whatsappId: '123456',
      phone: '+1234567890',
      type: 'lead',
      customerId: 'customer-id'
    })).rejects.toThrow('Contact with this WhatsApp ID already exists');

    sinon.assert.notCalled(contactRepository.save);
  });

  afterEach(() => {
    sinon.restore();
  });
});