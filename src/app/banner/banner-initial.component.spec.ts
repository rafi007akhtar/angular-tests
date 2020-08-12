import { BannerComponent } from './banner-initial.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('Banner component (with beforeEach)', () => {
    let fixture: ComponentFixture<BannerComponent>;
    let component: BannerComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BannerComponent]
        });
        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeDefined();
    });
});
