import { HeroDetailComponent } from './hero-detail.component';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Hero, TestHeroService, getTestHeroes } from '../model/testing/test-hero.service';
import { HeroModule } from './hero.module';
import { ActivatedRouteStub, ActivatedRoute } from '../../testing/activated-route-stub';
import { HeroService } from '../model/hero.service';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { click } from 'src/testing';
import { HeroDetailService } from './hero-detail.service';

let fixture: ComponentFixture<HeroDetailComponent>;
let page: Page;

// Borrowing the Page class from Angular's docs
// Source: https://angular.io/guide/testing-components-scenarios#use-a-page-object
class Page {
    // getter properties wait to query the DOM until called.
    get buttons() {
      return this.queryAll<HTMLButtonElement>('button');
    }
    get saveBtn() {
      return this.buttons[0];
    }
    get cancelBtn() {
      return this.buttons[1];
    }
    get nameDisplay() {
      return this.query<HTMLElement>('span');
    }
    get nameInput() {
      return this.query<HTMLInputElement>('input');
    }
  
    gotoListSpy: jasmine.Spy;
    navigateSpy: jasmine.Spy;
  
    constructor(someFixture: ComponentFixture<HeroDetailComponent>) {
      // get the navigate spy from the injected router spy object
      const routerSpy = someFixture.debugElement.injector.get(Router) as any;
      this.navigateSpy = routerSpy.navigate;
  
      // spy on component's `gotoList()` method
      const someComponent = someFixture.componentInstance;
      this.gotoListSpy = spyOn(someComponent, 'gotoList').and.callThrough();
      debugger;
    }
  
    //// query helpers ////
    private query<T>(selector: string): T {
      return fixture.nativeElement.querySelector(selector);
    }
  
    private queryAll<T>(selector: string): T[] {
      return fixture.nativeElement.querySelectorAll(selector);
    }
}

function newEvent(eventName: string, bubbles = false, cancelable = false) {
    const evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
}

describe('HeroDetailComponent - when navigates to existing hero', () => {
    let component: HeroDetailComponent;
    // let page: Page;
    // let fixture: ComponentFixture<HeroDetailComponent>;
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = new ActivatedRouteStub()

    let expectedHero: Hero;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [HeroModule],
            // declarations: [HeroDetailComponent],
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
        page = new Page(fixture);

        fixture.detectChanges();  // ngOnInit

        return fixture.whenStable().then(() => {
            fixture.detectChanges();  // async calls
        })
    }

    it('should display that hero\'s name', () => {
        expect(page.nameDisplay.textContent).toBe(expectedHero.name);
    });

    it('should not navigate when clicked on save until save resolves', () => {
        // const saveSpy = spyOn(component.heroDetailService, 'saveHero');  // can NOT use this method since the instance is private
        // instead, using the injector to get the instance of the service
        const hds = fixture.debugElement.injector.get(HeroDetailService);
        const saveSpy = spyOn(hds, 'saveHero').and.callThrough();

        fakeAsync(() => {
            // Adding this fakeAsync block outside of the expect so as to enforce
            // the testing BEFORE the subscribe has resolved
            // otherwise it was passing at some runs and failing at others
            click(page.saveBtn);
            expect(saveSpy.calls.any()).toBeTruthy('HeroService.save was called');
            expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
            tick();
        });
    });

    it('should navigate when clicked on save after save resolves', fakeAsync(() => {
        click(page.saveBtn);
        tick();  // waiting for save to resolve
        expect(page.navigateSpy.calls.any()).toBeTruthy('router.navigate was called');;
    }));

    it('should navigate when clicked on cancel', () => {
        click(page.cancelBtn);
        expect(page.navigateSpy.calls.any()).toBeTruthy('router.navigate was called');
    });

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
    let component: HeroDetailComponent;
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
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
    let component: HeroDetailComponent;
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = new ActivatedRouteStub();

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [HeroModule],
            // declarations: [HeroDetailComponent],
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
        page = new Page(fixture);

        fixture.detectChanges();  // ngOnInit

        return fixture.whenStable().then(() => {
            fixture.detectChanges();  // async calls
        })
    }

    it('should try to navigate back to hero list', () => {
        expect(page.gotoListSpy.calls.any()).toBeTruthy('comp.gotoList called');
        expect(page.navigateSpy.calls.any()).toBeTruthy('router.navigate called');
    });
});
