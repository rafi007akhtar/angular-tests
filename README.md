# angular-tests

Forked from the original [sample app](https://angular.io/generated/live-examples/testing/stackblitz.html) from [angular.io](https://angular.io/guide/testing), this app is used for practising testing using Jasmine and Karma.

# Notes

As I was practising testing on [angular.io](https://angular.io), I took some notes on each section.

## Intro
(yet to be written)

## Code coverage
(yet to be written)

## Testing services
(yet to be written)

## Basic of Testing Component
(yet to be written)

## Component testing scenarion

### Routing component
- This component tells angular to navigate from the current component to another component.
- Takeaway: **You can use a spy object as a stub to a class.**

    ```ts
    // Stubbing the router component

    // Inside beforeEach
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // Inside TestBed.configureTestingModule
    TestBed.configureTestingModule({
        providers: [
            { provide: Router, useValue: routerSpy }
        ]
    })
    
    ```

### Routed Component
- It is the destination of a routing component.
- For test cases involving async code, the use of `fakeAsync` or `waitForAsync` is indespensible. In such cases, **group all related async codes inside a `describe` block each**, like so:

    ```ts
    describe('all async code in this block depends on value 1 of the async variable', () => { /* code */ });
    describe('all async code in this block depends on value 2 of the async variable', () => { /* code */ });
    describe('all async code in this block depends on value 3 of the async variable', () => { /* code */ });
    ```

- This is crucial, otherwise, if all test cases were in the same describe block, different values of the variable will have conflict with each other. 
- The result being, in some test runs, block 1's test cases will fail due to some other block.
- In other cases, block 2's test cases will fail and in other cases block 3's will fail.
- This is specially scary during build, as different build runs will fail due to different errors without even changing the code. Hence, group your async testing in different describe blocks.
- In async scenarios like these, fixture should be detecting changes only when changes are ready. For doing so, write a function outside of `beforeEach` but inside the `describe`, like below, and call it in the `beforeEach` block.

    ```ts
    // inside describe but outside beforeEach
    function createComponent() {
        fixture = TestBed.createComponent(/*component class*/);
        component = fixture.createInstance;

        fixture.detectChanges(); // ngOnInit

        // now, due to async code, run detech changes through a Promise
        return fixture.whenStabe().then(() => {fixture.detectChanges});
    }

    // inside beforeEach
    beforeEach(fakeAsync(() => {
        // complete the TestBed
        TestBed.configureTestingModule(/* complete the TestBed */);
        createComponent();
    }));
    ```

### Nested Component Tests
- Shallow component testing: here, the code reduces the stubbing to only those components required in the component's test cases.
- **`NO_ERRORS_SCHEMA`** instructs the compiler to ignore the stubs not found during compilation.
    ```ts
    TestBed.configureTestingModule({
        schemas: [ NO_ERRORS_SCHEMA ]
    })
    ```
- Do *not* overuse `NO_ERRORS_SCHEMA`, since the compiler will then be unable to tell you where the error is in case any interaction has happened with the ignored stubs.
