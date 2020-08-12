import { BannerComponent } from './banner-initial.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('Banner component (with beforeEach)', () => {
    let fixture: ComponentFixture<BannerComponent>;  // this will help the test interact with the template of the component
    let component: BannerComponent;
    let bannerElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BannerComponent]
        });
        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
        bannerElement =  fixture.nativeElement;  // this will help interact with the DOM elements of the component
    });

    it('should be created', () => {
        expect(component).toBeDefined();
    });

    it('should contain "banner works!"', () => {
        expect(bannerElement.textContent).toBe('banner works!');
    });

    it('should have <p> with "banner works!"', () => {
        const p = bannerElement.querySelector('p');
        expect(p.textContent).toBe("banner works!");
    });
});
