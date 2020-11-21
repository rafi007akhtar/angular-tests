# angular-tests

Forked from the original [sample app](https://angular.io/generated/live-examples/testing/stackblitz.html) from [angular.io](https://angular.io/guide/testing), this app is used for practising testing using Jasmine and Karma.

# Notes

As I was practising testing on [angular.io](https://angular.io), I took some notes on each section.

## Intro
[[angular.io link](https://angular.io/guide/testing)]

CLI Command to run the test cases:
```sh
ng test
```

## Code coverage
[[angular.io link](https://angular.io/guide/testing-code-coverage)]

- Enable the following flag in [angular.json](./angular.json) file to recreate code covg. on every test.
    ```json
    "test": {
    "options": {
        "codeCoverage": true
        }
    }
    ```
- Add the following element to the `reports` array in [karma.conf.js](./karma.conf.js) file.
    ```ts
    coverageIstanbulReporter: {
        reports: [
            'html',
            'lcovonly',
            'text-summary'  // to view the coverage on CLI while running test cases
        ],
        thresholds: {
            // to enforce coverage percentages
            statements: 80,
            lines: 80,
            branches: 80,
            functions: 80
        }
    }
    ```
- Run the following line to generate code-coverage while running test cases.
    ```sh
    ng test --code-coverage
    ```

## Testing services
[[angular.io link](https://angular.io/guide/testing-services)]

- Don't use actual services when calling them; instead create mocks and use them as stubs while calling them.
- The easiest way to create mocks is by using _spies_.
- Spies docs [link](https://jasmine.github.io/2.9/introduction#section-Spies) on Jasmine website.
- `TestBed` is used to emulate an `@NgModule`.
- Syntax to configure the testing module.
    ```ts
    const stub = {
        stubMethod: () => { /* fill in the bare minimum needed */ }
    };

    beforeEach(() => {
        TestBed.configureTestingModule(
            declarations: [ /* add all classes to declare */ ],
            providers: [
                { provide: className, useValue: stub }
            ]
        );
    });
    ```
- In order to setup a spy for the `getValue` method of the `ValueService` class, for example, the syntax is:
    ```ts
    const spy = jasmine.createSpyObject('ValueService', ['getValue']);  // method 1
    spyOn('ValueService', ['getValue']);
    ```
- As of Angular 9, `get` method of `TestBed` is depracated, and is replaced with `inject`.
    ```ts
    const service: SomeClass;
    service = TestBed.inject(SomeClass);
    ```

- Example file: [demo.component.spec.ts](./src/app/demo/demo.spec.ts)

## Basic of Testing Component
(yet to be written)

## Component testing scenarios

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
- The result being, in some test runs, block 1's test cases will fail due to some other block. In other cases, block 2's test cases will fail and in other cases block 3's will fail.
- This is specially scary during build, as different build runs will fail due to different errors without even changing the code. Hence, group your async testing in different describe blocks.
- In async scenarios like these, fixture should be detecting changes only when changes are ready. For doing so, write a function outside of `beforeEach` but inside the `describe`, like below, and call it in the `beforeEach` block.

    ```ts
    // inside describe but outside beforeEach
    function createComponent() {
        fixture = TestBed.createComponent(/*component class*/);
        component = fixture.componentInstance;

        fixture.detectChanges(); // ngOnInit

        // now, due to async code, run detect changes through a Promise
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
        schemas: [ NO_ERRORS_SCHEMA ],
        // ...
    })
    ```
- Do *not* overuse `NO_ERRORS_SCHEMA`, since the compiler will then be unable to tell you where the error is in case any interaction has happened with the ignored stubs.

### Components with `RouterLink`
- I've used `RouterLinkDirectiveStub` as a ready-made stub of the `RouterLink` class.
- Source: [link on angular.io](https://angular.io/guide/testing-components-scenarios#components-with-routerlink)
- `By.directive(type)` can be used to fetch all injected elements of the specified type. Example:
    ```ts
    const routerLinks = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));  // replaced `type` with `RouterLinkDirectiveStub`
    ```

### Use a `page` object
- The `page` object acted as stubbed version of hero-detail component. It is basically a helper class designed to provide attributes, methods, and spies for testing this otherwise challenging-to-stub class.
- Source: [link on angular.io](https://angular.io/guide/testing-components-scenarios#use-a-page-object)
- **Testing when the method contains a subscribe**. Steps:
    1. Put the `it` body inside a `fakeAsync` method.
    2. Call the method containing subscribe inside the test.
    3. Call the `tick` method to wait until subscribe ends before testing further.
    4. Write the expected tests. In this way:
    ```ts
    it('spec to test a method with subscribe', fakeAsync(() => {
        methodContainingSubscribe();
        tick();  // waits until subscribe completes
        expect(/* replace with expectation */)/* chain with test method */
    }));
    ```
- If a particular `Service` instance is declared `private` in a component, and if you wish to stub a `method` offered by this `service`, then use the `injector` method, like so:
    ```ts
    const injectedService = fixture.debugElement.injector.get(Service);
    const serviceSpy = spyOn(injectedService, 'method');
    // note: this method does not work with `jasmine.createSpyObject`, so use `spyOn` instead
    ```

### Using `compileComponents()`
- If the testing _only_ happens in in Angular CLI, the `compileComponents` method can be skipped as all the external files are in memory.
- If the testing happens in a non-CLI external env, and if the file tested has external files (like external template and css files), the compilation will fail.
- REASON: the compiler must read external files, which is an async tasks.
- SOLUTION: At the **end** of the TestBed, chain it with `compileComponents` method inside of an async zone.
- Procedures:
    ```ts
    // procedure 1: two beforeEach's
    beforeEach(fakeAsync(() => {
        TestBed
            .configureTestingModule({ /* providers, etc */ })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(/*component class*/);
        component = fixture.componentInstance;
        // and so on ...
    });

    // procedure 2: one considlated beforeEach
    beforeEach(fakeAsync(() => {
        TestBed
            .configureTestingModule({ /* providers, etc */ })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(/*component class*/);
                component = fixture.componentInstance;
                // and so on ...
            })
    }));
    ```

### Module Imports
- When using a consolidated `compileComponents` implementation, if you need to put `detectChanges` method, put it _twice_: first, inside `beforeEach`, and then inside the `it`, like so:
    ```ts
    beforeEach(fakeAsync(() => {
        TestBed
            .configureTesingModule({/* providers, etc */})
            .compileComponents()
            .then(() => {
                // initialize fixture, component etc
                fixture.detectChanges();
            });
    }));

    it('some test',  fakeAsync(() => {
        fixture.detectChanges();
        // now write expect statements containing the test
    }));
    ```

### Override component providers
- If you want to create a _new_ spy, instead of spying on another method, instead of using `createSpyObject` or `spyOn`, use `jasmine.createSpy` method, like so:
    ```ts
    const spy = jasmine.createSpy('spyName');  // this can be chained with other methods like `and` and be provided w/ functionality accordingly
    ```
