import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailService } from './hero-detail.service';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { TestHeroService } from '../model/testing/test-hero.service';
import { HeroModule } from './hero.module';
import { ActivatedRouteStub, ActivatedRoute } from '../../testing/activated-route-stub';
import { HeroService } from '../model/hero.service';
import { Router } from '@angular/router';

function newEvent(eventName: string, bubbles = false, cancelable = false) {
    const evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
}

describe('when navigates to existing hero', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let component: HeroDetailComponent;
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteStub = new ActivatedRouteStub()

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [ HeroModule ],
            declarations: [ HeroDetailComponent ],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: HeroService, useValue: TestHeroService },
                { provide: Router, useValue: routerSpy }
            ]
        });
        createComponent();
    }));

    function createComponent() {
        fixture = TestBed.createComponent(HeroDetailComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();  // ngOnInit

        return fixture.whenStable().then(() => {
            fixture.detectChanges();  // async calls
        })
    }

    it('should convert hero name to Title Case', () => {
        const hostElement = fixture.nativeElement;
        const input: HTMLInputElement = hostElement.querySelector('input');
        const name: HTMLElement = hostElement.querySelector('span');

        input.value = 'some generic hero';  // simulate an input change
        input.dispatchEvent(newEvent('input'));  // tell Angular an input change has been simulated

        fixture.detectChanges();

        expect(name.textContent).toBe('Some Generic Hero');
    });
});
