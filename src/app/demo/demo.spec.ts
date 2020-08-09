import { ValueService, MasterService, LightswitchComponent } from './demo';

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

    it('should return stubbed value from getValue method using a spy', () => {
        const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);

        // the method getValue should return stub value when called
        const stubValue = 'stub value';
        valueServiceSpy.getValue.and.returnValue(stubValue);

        masterService = new MasterService(valueServiceSpy);
        expect(masterService.getValue()).toBe(stubValue, 'service return stub value');
        expect(valueServiceSpy.getValue.calls.count()).toBe(1, 'spy method was called once');
        expect(valueServiceSpy.getValue.calls.mostRecent().returnValue).toBe(stubValue);
    });
});

describe('LightswitchComp', () => {
    let comp: LightswitchComponent;

    beforeEach(() => {
        comp = new LightswitchComponent();
    });

    it('should toggle isOn on calling of clicked method', () => {
        expect(comp.isOn).toBe(false, 'initially the switch will be off');
        comp.clicked();
        expect(comp.isOn).toBe(true, 'After clicking the switch, it should turn on');
        comp.clicked();
        expect(comp.isOn).toBe(false, 'After clicking it again, it should turn back off');
    });

    it('should show a message with on / off state', () => {
        expect(comp.message).toContain('Off', 'initially the switch will be off');
        comp.clicked();
        expect(comp.message).toContain('On', 'After clicking the switch, it should turn on');
        comp.clicked();
        expect(comp.message).toContain('Off', 'After clicking it again, it should turn back off');
    });
});

// testing below this will not use beforeEach function
function setup() {
    const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    const stubValue = 'stub value';
    const masterService = new MasterService(valueServiceSpy);
    valueServiceSpy.getValue.and.returnValue(stubValue);
    
    return {masterService, stubValue, valueServiceSpy };
}

describe('MasterService without beforeEach', () => {
    it('should return a stub value from getValue method using a spy', () => {
        const { masterService, stubValue, valueServiceSpy } = setup();
        expect(masterService.getValue()).toBe(stubValue);
        expect(valueServiceSpy.getValue.calls.count()).toBe(1);
        expect(valueServiceSpy.getValue.calls.mostRecent().returnValue).toBe(stubValue);
    });
});
