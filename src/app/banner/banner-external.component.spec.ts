import { BannerComponent } from './banner-external.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';

let fixture: ComponentFixture<BannerComponent>;
let component: BannerComponent;

describe('BannerComponent (with beforeEach)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BannerComponent]
        });
        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });
});
