import { FindContactsUseCase } from '@/core/usecases/contact/FindContactUseCase';
import sinon from 'sinon';

describe('FindContactsUseCase', () => {
  let contactRepository: any;
  let findContactsUseCase: FindContactsUseCase;

  beforeEach(() => {
    contactRepository = {
      findByCustomerId: sinon.stub(),
      findById: sinon.stub()
    };

    findContactsUseCase = new FindContactsUseCase(contactRepository);
  });

  describe('findWithFilters', () => {
    it('should filter contacts by type and status', async () => {
      const mockContacts = [
        { getType: () => 'lead', getStatus: () => 'active', getTags: () => [] },
        { getType: () => 'client', getStatus: () => 'inactive', getTags: () => [] },
        { getType: () => 'lead', getStatus: () => 'active', getTags: () => [] }
      ];

      contactRepository.findByCustomerId.resolves(mockContacts);

      const result = await findContactsUseCase.findWithFilters({
        customerId: 'customer-id',
        type: 'lead',
        status: 'active'
      });

      expect(result).toHaveLength(2);
      sinon.assert.calledWith(contactRepository.findByCustomerId, 'customer-id');
    });

    it('should filter contacts by tags', async () => {
      const mockContacts = [
        { getTags: () => ['important'], getType: () => 'lead', getStatus: () => 'active' },
        { getTags: () => ['urgent'], getType: () => 'lead', getStatus: () => 'active' },
        { getTags: () => ['important', 'urgent'], getType: () => 'lead', getStatus: () => 'active' }
      ];

      contactRepository.findByCustomerId.resolves(mockContacts);

      const result = await findContactsUseCase.findWithFilters({
        customerId: 'customer-id',
        tags: ['important']
      });

      expect(result).toHaveLength(2);
      sinon.assert.calledOnce(contactRepository.findByCustomerId);
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});