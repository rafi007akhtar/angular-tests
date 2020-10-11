import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

// stubs for components that are not important in RouterLink tests
@Component({selector: 'app-banner', template: ''})
class BannerStubComponent {}

@Component({selector: 'app-welcome', template:''})
class WelcomeStubComponent {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {}

describe('AppComponent', () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent, BannerStubComponent, WelcomeStubComponent,
                RouterOutletStubComponent
            ],
            schemas: [ NO_ERRORS_SCHEMA ]  // ignore the absence of the stubs that are not needed for the tests
        });
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
    });
});
