import { TestBed } from '@angular/core/testing';

import { ContractTemplatesService } from './contract-templates.service';

describe('ContractTemplatesService', () => {
  let service: ContractTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
