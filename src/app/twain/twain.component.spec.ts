import { TwainComponent } from './twain.component';
import { ComponentFixture, TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { TwainService } from './twain.service';
import { of, throwError } from 'rxjs';
import { asyncData } from '../../testing/async-observable-helpers';
import { last } from 'rxjs/operators';

// imports for marble testing
import { cold, getTestScheduler } from 'jasmine-marbles';

describe('Twain Component', () => {
    let testQuote: string;
    let fixture: ComponentFixture<TwainComponent>;
    let component: TwainComponent;
    let quoteEl: HTMLElement;
    let quoteSpy: jasmine.Spy;

    function errorMessage(): string | null {
        const el: HTMLElement = fixture.nativeElement.querySelector('.error');
        return el ? el.textContent : null;
    }

    beforeEach(() => {
        testQuote = 'Test Quote';

        const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);  // a fake TwainService object with a getQuote spy
        // The following spy will return a SYNCHRONOUS observable with test data
        quoteSpy = twainService.getQuote.and.returnValue(of(testQuote));

        TestBed.configureTestingModule({
            declarations: [TwainComponent],
            providers: [{
                provide: TwainService,
                useValue: twainService
            }]
        });

        fixture = TestBed.createComponent(TwainComponent);
        component = fixture.componentInstance;
        quoteEl = fixture.nativeElement.querySelector('.twain');
    });

    it('should show quote after component initialized', () => {
        fixture.detectChanges();
        expect(quoteEl.textContent).toBe(testQuote);
        expect(quoteSpy.calls.any()).toBeTrue();
    });

    it('should show error when Twain service fails', fakeAsync(() => {
        quoteSpy.and.returnValue(
            throwError('Twain test failure')
        );

        fixture.detectChanges();  // ngOnInit

        tick();  // to wait (for 0 s) so as to counteract component's setTimeout

        fixture.detectChanges();  // post setTimeout

        expect(errorMessage()).toContain('test failure');
        expect(quoteEl.textContent).toBe('...');
    }));

    describe('testing with asynchronous observables', () => {
        beforeEach(() => { quoteSpy.and.returnValue(asyncData(testQuote)); })

        it('should show quote after getQuote method (fakeAsync)', fakeAsync(() => {
            fixture.detectChanges();
            expect(quoteEl.textContent).toBe('...');

            tick();
            fixture.detectChanges();

            expect(quoteEl.textContent).toBe(testQuote, 'should show test quote');
            expect(errorMessage()).toBeNull('should not show error');
        }));

        it('should show quote after getQuote (async)', async(() => {
            fixture.detectChanges();
            expect(quoteEl.textContent).toBe('...');

            // now, instead of using tick method, the whenStable method will be used
            // it will house all the code that follows tick, like so:
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(quoteEl.textContent).toBe(testQuote, 'should show test quote');
                expect(errorMessage()).toBeNull('should not show error');
            })
        }));

        it('should show last quote (pipe done)', (done: DoneFn) => {
            fixture.detectChanges();

            component.quote.pipe(last()).subscribe(() => {
                fixture.detectChanges();
                expect(quoteEl.textContent).toBe(testQuote, 'should show test quote');
                expect(errorMessage()).toBeNull('should not show error');
                done();
            });
        });

        it('should show quote after getQuote (spy done)', (done: DoneFn) => {
            fixture.detectChanges();

            quoteSpy.calls.mostRecent().returnValue.subscribe(() => {
                fixture.detectChanges();
                expect(quoteEl.textContent).toBe(testQuote, 'should show test quote');
                expect(errorMessage()).toBeNull('should not show error');
                done();
            });
        });

        // marble testing follows up next
        it('should show quote after getQuote (marbles)', () => {
            // make a cold observable for the quote
            const q$ = cold('---q|', { q: testQuote })  // wait for 3 frames (---), emit the mapped quote (q), and complete (|)
            // make the getQuote method return this cold observale
            quoteSpy.and.returnValue(q$);

            fixture.detectChanges();
            expect(quoteEl.textContent).toBe('...', 'should show placeholder');

            // activate the marble observable
            getTestScheduler().flush();

            fixture.detectChanges();
            expect(quoteEl.textContent).toBe(testQuote, 'should show test quote');
            expect(errorMessage()).toBeNull();
        });

        // marble error testing
        it('should show error when TwainService fails', fakeAsync(() => {
            const q$ = cold('---#|', null, new Error('Twain service test failure'));
            quoteSpy.and.returnValue(q$);

            fixture.detectChanges();
            expect(quoteEl.textContent).toBe('...', 'should show placeholder');
            
            getTestScheduler().flush();
            tick();  // component shows error after a setTimeout

            fixture.detectChanges();
            expect(quoteEl.textContent).toBe('...', 'should show placeholder');
            expect(errorMessage()).toContain('test failure');
        }));
    });

});
