import { WelcomeComponent } from './welcome.component';
import { TestBed } from '@angular/core/testing';
import { UserService } from '../model/user.service';

/** The welcome component has a dependency - UserService component.
 * Note: Dependencies on a component mean the classes you are instantiating in the component's contructor.
 * In this case, the UserService component.
 */

// In order to solve this dependency, first create a mock class that mimics the minimum requirement of UserService
class MockUserService {
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
