import { ValueService, MasterService } from './demo';
import { TestBed } from '@angular/core/testing';

describe('demo with TestBed', () => {
    describe('ValueService', () => {
        let service: ValueService;
    
        beforeEach(() => {
            TestBed.configureTestingModule({ providers: [ValueService] });
            service = TestBed.inject(ValueService);
        });
    
        it('should use ValueService', () => {
            expect(service.getValue()).toBe('real value');
        });
    });

    describe('MasterService', () => {
        let masterService: MasterService;
        let valueServiceSpy: jasmine.SpyObj<ValueService>;
        
        beforeEach(() => {
            const spy = jasmine.createSpyObj('ValueService', ['getValue']);

            TestBed.configureTestingModule({ providers: [
                MasterService,
                { provide: ValueService, useValue: spy }
            ] });

            masterService = TestBed.inject(MasterService);
            valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
        });

        it('should return a stub value from getValue method using a spy', () => {
            const stubValue = 'stub value';
            valueServiceSpy.getValue.and.returnValue(stubValue);

            expect(masterService.getValue()).toBe(stubValue, 'service returned stub value');
            expect(valueServiceSpy.getValue.calls.count()).toBe(1, 'spy method was called once');
            expect(valueServiceSpy.getValue.calls.mostRecent().returnValue).toBe(stubValue)
        });
        
    });
});


