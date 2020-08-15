import { BannerComponent } from './banner.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('Banner component (inline template)', () => {
    let component: BannerComponent;
    let fixture: ComponentFixture<BannerComponent>;
    let h1: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BannerComponent]
        });

        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
        h1 = fixture.nativeElement.querySelector('h1');
    });

    it('should be created', () => {
        expect(component).toBeDefined();
    });

    it('should have no title in DOM without detecting changes', () => {
        expect(h1.textContent).toBe('');
    });

    it('should show the correct title after detecting changes', () => {
        /**
         * NOTE: Before proceeding further, note that the following test would fail
         * `expect(h1.textContent).toBe(component.title);`
         * 
         * REASON: The `title` attribute is not yet created, hence you need to wait until Angular detects changes.
         * 
         * ALSO: the reason why a similar test worked in banner-initial.component.spec.ts is because its component used INLINE template.
         * The text 'banner works!' in that component was not stored in a variable or attribute inside the class; instead it was inside the inline HTML tag.
         * In other words, it was not a variable that needed to be created. It was simply a hard-coded text that Angular did not have to wait for before detecting.
         * 
         * BUT: in our case, the title is a component attribute, hence we need to apply the `detectChanges` method before testing it.
         */
        
        fixture.detectChanges();
        expect(h1.textContent).toBe(component.title);
    });
});

