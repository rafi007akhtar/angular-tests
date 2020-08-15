import { WelcomeComponent } from './welcome.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserService } from '../model/user.service';

/** The welcome component has a dependency - UserService component.
 * Note: Dependencies on a component mean the classes you are instantiating in the component's contructor.
 * In this case, the UserService component.
 */

// In order to solve this dependency, first create a mock class that mimics the minimum requirement of UserService
class MockUserService {
    // Note: Doubles like mocks are only used as a useClass in TestBed provider; everywhere else, use the injected service
    public isLoggedIn = true;
    public user = { name: 'Mock user' };
}

describe('Welcome component (class only)', () => {
    let comp: WelcomeComponent;
    let userService: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WelcomeComponent,
                { provide: UserService, useClass: MockUserService }
            ]
        });

        comp = TestBed.inject(WelcomeComponent);
        userService = TestBed.inject(UserService);
    });

    it('should not have welcome message JUST after construction', () => {
        expect(comp.welcome).toBeUndefined();
    });

    it('should have a welcome message after initialization', () => {
        comp.ngOnInit();
        expect(comp.welcome).toContain(userService.user.name);
    });

    it('should ask the user to log in if not logged in after init', () => {
        userService.isLoggedIn = false;
        comp.ngOnInit();
        expect(comp.welcome).not.toContain(userService.user.name);
        expect(comp.welcome).toContain('log in');
    });
});

describe('Welcome component', () => {
    let userServiceStub: Partial<UserService>;
    let fixture: ComponentFixture<WelcomeComponent>;
    let comp: WelcomeComponent;
    let userService: UserService;
    let el: HTMLElement;

    beforeEach(() => {
        userServiceStub = {
            // Note: Doubles like stubs are only used as useValue in TestBed provider; everywhere else, use the injected service
            isLoggedIn: true,
            user: { name: 'Test User' }
        }

        TestBed.configureTestingModule({
            declarations: [WelcomeComponent],
            providers: [{
                provide: UserService,
                useValue: userServiceStub
            }]
        });

        fixture = TestBed.createComponent(WelcomeComponent);
        comp = fixture.componentInstance;
        userService = fixture.debugElement.injector.get(UserService);
        /* Alternatively,
            userService = TestBed.inject(UserService);
        But, this will work only when the only provider of the service is the root testing module (which is true in this case)
        But the injector from the component's fixture will always work.
        */

        el = fixture.nativeElement.querySelector('.welcome');
    });

    it('should welcome the user', () => {
        fixture.detectChanges();
        const greeting = el.textContent;
        expect(greeting).toContain('Test User');
        expect(greeting).toContain('Welcome');
    });

    it('should welcome "Rafi"', () => {
        userService.user.name = 'Rafi';
        fixture.detectChanges();
        expect(el.textContent).toContain('Rafi');
    });

    it('should request log in if not logged in', () => {
        userService.isLoggedIn = false;
        fixture.detectChanges();
        expect(el.textContent).not.toContain('Welcome');
        expect(el.textContent).toContain('log in');
    });
});
