import { TwainComponent } from './twain.component';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TwainService } from './twain.service';
import { of, throwError } from 'rxjs';

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
            declarations: [ TwainComponent ],
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
});
