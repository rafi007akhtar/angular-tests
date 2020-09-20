import { HeroDetailComponent } from './hero-detail.component';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Hero, TestHeroService, getTestHeroes } from '../model/testing/test-hero.service';
import { HeroModule } from './hero.module';
import { ActivatedRouteStub, ActivatedRoute } from '../../testing/activated-route-stub';
import { HeroService } from '../model/hero.service';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

function newEvent(eventName: string, bubbles = false, cancelable = false) {
    const evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
}

describe('HeroDetailComponent - when navigates to existing hero', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let component: HeroDetailComponent;
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteStub = new ActivatedRouteStub()

    let expectedHero: Hero;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [HeroModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: HeroService, useClass: TestHeroService },
                { provide: Router, useValue: routerSpy }
            ]
        });

        expectedHero = getTestHeroes()[0];  // first hero
        activatedRouteStub.setParamMap({id: expectedHero.id});
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

describe('HeroDetailComponent - when navigates with no hero id', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let component: HeroDetailComponent;
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteStub = new ActivatedRouteStub()

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [HeroModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: HeroService, useClass: TestHeroService },
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

    it('should have hero.id to be 0', () => {
        expect(component.hero.id).toBe(0);
    });

    it('should display empty hero name', () => {
        const nameDe: DebugElement = fixture.debugElement.query(By.css('span'));
        const nameEl: HTMLElement = nameDe.nativeElement;
        expect(nameEl.textContent).toBe('')
    });
});

describe('HeroDetailComponent - when navigates to non-existent hero', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let component: HeroDetailComponent;
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteStub = new ActivatedRouteStub();

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [HeroModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: HeroService, useClass: TestHeroService },
                { provide: Router, useValue: routerSpy }
            ]
        });

        activatedRouteStub.setParamMap({id: 99999});
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

    it('should try to navigate back to hero list', () => {
        pending('will complete writing this after learning about the Page class in future');
    });
});
