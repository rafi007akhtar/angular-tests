import { BannerComponent } from './banner.component';
import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';

describe('Banner component (auto detect changes)', () => {
    let component: BannerComponent;
    let fixture: ComponentFixture<BannerComponent>;
    let h1: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BannerComponent],

            // the following provider will make sure Angular detects changes automatically
            // so detectChanges method will not have to be applied
            providers: [{provide: ComponentFixtureAutoDetect, useValue: true}]
        });
        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
        h1 = fixture.nativeElement.querySelector('h1');
    });

    it('should show the correct title without detecting changes', () => {
        expect(h1.textContent).toBe(component.title);
    });

    it('should show old title when changed', () => {
        const titleBackup = component.title;
        component.title = 'new title';
        expect(h1.textContent).toBe(titleBackup);  // this is because ComponentFixtureAutoDetect only detects async changes; this change was direct and synchronous
    });

    it('should show new title after applying detectChanges', () => {
        component.title = 'new title';
        fixture.detectChanges();  // for synchronous changes, we need detectChanges; hence as a safeguard detectChanges will often be preferred to ComponentFixtureAutoDetect
        expect(h1.textContent).toBe('new title');
    });
});
