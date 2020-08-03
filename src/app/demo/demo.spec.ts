import { ValueService, MasterService } from './demo';

/**
 * Fakes go in this class
 */
export class FakeValueService extends ValueService {
    public value = 'fake service value';
}

describe('Value Service', () => {
    let service: ValueService;

    beforeEach(() => { service = new ValueService(); });

    it('should return real value from getValue method', () => {
        const value = service.getValue();
        expect(value).toBe('real value')
    });

    it('should return real value from getObservable method', (done: DoneFn) => {
        service.getObservableValue().subscribe(val => {
            expect(val).toBe('observable value');
            done();
        });
    });

    it('should return return value from getPromiseValue method', (done: DoneFn) => {
        service.getPromiseValue().then((val) => {
            expect(val).toBe('promise value');
            done();
        })
    });

    it('should return real value from getObservableDelayValue method', (done: DoneFn) => {
        service.getObservableDelayValue().subscribe(val => {
            expect(val).toBe('observable delay value');
            done();
        });
    });
});

describe('Master Service', () => {
    let masterService: MasterService;

    it('should return real value from getValue method', () => {
        masterService = new MasterService(new ValueService());
        expect(masterService.getValue()).toBe('real value');
    });

    it('should return fake value from a fake service', () => {
        masterService = new MasterService(new FakeValueService());
        expect(masterService.getValue()).toBe('fake service value');  // child value (fake) will override parent value (real)
    });

    // learned something new in the following example - casting object to class instance!
    it('should return faked value from getValue method of a fake object turned to class', () => {
        const fake = {
            getValue: () => 'fake object value' 
        };

        masterService = new MasterService(fake as ValueService);  // THIS LINE - works because `fake` is a constructable object
        expect(masterService.getValue()).toBe('fake object value');
    });
});
