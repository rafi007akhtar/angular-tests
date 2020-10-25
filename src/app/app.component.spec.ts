import { Component, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterLinkDirectiveStub } from '../testing/router-link-directive-stub';
import { By } from '@angular/platform-browser';

// stubs for components that are not important in RouterLink tests
@Component({selector: 'app-banner', template: ''})
class BannerStubComponent {}

@Component({selector: 'app-welcome', template:''})
class WelcomeStubComponent {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {}

let routerLinks: RouterLinkDirectiveStub[];
let linkDes: DebugElement[];

describe('AppComponent', () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent, BannerStubComponent, WelcomeStubComponent,
                RouterOutletStubComponent, RouterLinkDirectiveStub
            ],
            schemas: [ NO_ERRORS_SCHEMA ]  // ignore the absence of the stubs that are not needed for the tests
        });
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();

        // find all debugElements with RouterLink stubs
        linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));

        // fetch each link instance
        routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    });

    it('can instantiate the component', () => {
        expect(comp).toBeDefined();
    });

    it('can get all the RouterLinks from template', () => {
        expect(routerLinks.length).toBe(3, 'three routerLinks');
        expect(routerLinks[0].linkParams).toContain('/dashboard');
        expect(routerLinks[1].linkParams).toContain('/heroes');
        expect(routerLinks[2].linkParams).toContain('/about');
    });

    it('can click Heroes link in template', () => {
        const heroesLink = routerLinks[1];
        expect(heroesLink.navigatedTo).toBeNull('should not have navigated before clicking');

        const heroesDe = linkDes[1];
        heroesDe.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(heroesLink.navigatedTo).toContain('/heroes');
    })
});
