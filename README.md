# angular-tests

Forked from the original [sample app](https://angular.io/generated/live-examples/testing/stackblitz.html) from [angular.io](https://angular.io/guide/testing), this app is used for practising testing using Jasmine and Karma.

# :pencil: Notes

As I was practising testing on [angular.io](https://angular.io), I took some notes on each section.

## [Intro :arrow_upper_right:](https://angular.io/guide/testing)

CLI Command to run the test cases:
```sh
ng test
```

## [Code coverage :arrow_upper_right: ](https://angular.io/guide/testing-code-coverage)

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

## [Testing services :arrow_upper_right:](https://angular.io/guide/testing-services)

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
    spyOn('ValueService', ['getValue']);  // method 2
    ```
- As of Angular 9, `get` method of `TestBed` is depracated, and is replaced with `inject`.
    ```ts
    const service: SomeClass;
    service = TestBed.inject(SomeClass);
    ```

- Example file: [demo.spec.ts](./src/app/demo/demo.spec.ts)

## [Basic of Testing Component :arrow_upper_right:](https://angular.io/guide/testing-components-basics)

### [Component class testing :arrow_upper_right:](https://angular.io/guide/testing-components-basics#component-class-testing)
- Testing **event emitters**
    ```ts
    // INSIDE THE COMPONENT FILE
    // set up the event emiiter
    x = 5;
    @Output val = new EventEmitter<ClassName>;
    method() { this.val.emit(this.x); }

    // INSIDE THE SPEC FILE
    // trigger the event, then proceed as follows
    comp.val.subscribe(x => {
        expect(component.x).toBe(5)
    });
    ```
    Example file: [dashboard-hero.component.spec.ts](./src/app/dashboard/dashboard-hero.component.spec.ts)

- Other example file: [welcome.component.spec.ts](./src/app/welcome/welcome.component.spec.ts)

### [Component DOM testing :arrow_upper_right:](https://angular.io/guide/testing-components-basics#component-dom-testing)
- Using `nativeElement`
    ```ts
    const ne: HTMLElement = fixture.nativeElement; // fetch the nativeElement from fixture
    const el = ne.querySelector('query'); // run a CSS query to fetch the element
    ```
- Using `debugElement`
    ```ts
    const de: DebugElement = fixture.debugElement;
    const ne: HTMLElement = de.nativeElement;
    const el = ne.querySelector('query');
    ```
- Using `By` coupled with `debugElement`
    ```ts
    const de: DebugElement = fixture.debugElement;
    const queryResult = de.query(By.css('query')); // CSS query goes in 'query'
    const el = queryResult.nativeElement;
    ```
- Note: Do not reconfigure `TestBed` after calling `TestBed.createComponent`.

- Example file: [banner-initial.component.spec.ts](./src/app/banner/banner-initial.component.spec.ts)

## [Component testing scenarios :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios)

### [Component binding :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#component-binding)
- You can use `ComponentFixtureAutoDetect` as a limited alternative to `fixture.detectChanges`.
    ```ts
    // inside beforeEach
    TestBed.configureTestingModule({
        declarations: [ /* add the classes to declare */ ],
        providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
    });

    // inside an `it`
    this.heading = 'the heading';  // assume this variable is property-bound to html
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toBe('the heading');  // passes

    this.heading = 'new heading';
    expect(h1.textContent).toBe('new heading');  // fails
    ```
- Hence, automatic change will not apply if you make a manual change. (Instead, just use `fixture.detectChanges` all the time.)
- Example file: [banner.component.detect-changes.spec.ts](./src/app/banner/banner.component.detect-changes.spec.ts)

- You can use `dispatchEvent` to trigger an event, like input.
    ```ts
    const inputEl = fixture.nativeElement.querySelector('input');
    inputEl.value = 'some generic value';
    inputEl.dispatchEvent(new Event('input'));
    ```
- Example file: [hero-detail.component.spec.ts](./src/app/hero/hero-detail.component.spec.ts)

### [Component with external files :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#component-with-external-files)
- If template and CSS files are external, and if you're running the tests on a non-CLI platform, use `compileComponents`. (Discussed [below](#using-compilecomponents-arrow_upper_right).)

### [Component with a dependency :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#component-with-a-dependency)
- `TestBed.inject` does not work when you're trying to [override component providers](#override-component-providers-arrow_upper_right).
- Use the fixture to get the service instead in those cases.
    ```ts
    service = TestBed.inject(ClassName);  // does not work when component is overriden

    service = fixture.debugElement.injector.get(ClassName);  // works everytime
    ```
- Example file: [welcome.component.spec.ts](./src/app/welcome/welcome.component.spec.ts)

### [Component with async service :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#component-with-async-service)

- Use the `tick` method to counteract async delay in the code being tested, inside an async zone.
    ```ts
    // in the component file
    method() {
        setTimeout({
            this.x = 5;
        }, 1000);
    }
    
    // in the spec file
    it('tests the above method', fakeAsync(() => {
        component.method();
        tick(1000);  // put the delay in ms as parameter
        expect(component.x).toBe(5);
    }))
    ```
- Use `fakeAsync` as the async zone most of the time, and `async` (Angular 9 or below) or `waitForAsync` (Angular 10 or above) only when the test makes an XHR call.
- Async observables for data and error can be created using the `defer` method. See `asyncData` and `asyncError` in [async-observable-helpers.ts](./src/testing/async-observable-helpers.ts).
- Angular provides many async testing methods like `whenStable` and `done`. I'm skipping them, and more, here. But they can be found in Angular's testing guide, [here](https://angular.io/guide/testing-components-scenarios#component-with-async-service).
- Example file: [twain.component.spec.ts](./src/app/twain/twain.component.spec.ts)

### [Component marble tests :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#component-marble-tests)
- A **cold observable** does not produce data until you subscribe to it, like all `HttpClient` methods.
- A **hot observable** starts producing data before it is subscribed to, like `Router.events`.
- A **marble** is a virtual unit of time, and is denoted by a symbol, like `-`, `x`, `|`, `#`.
- The following line in testing using the `cold` marble method to _wait_ for three frames (`---`), _emit_ the mapped value (`x`), and _complete_ (`|`).
    ```ts
    let emittedValue;
    const x$ = cold('---x|', { x: emittedValue });
    ```
- The following line in testing activates the marble observable `getTestScheduler` method.
    ```ts
    getTestScheduler().flush();
    ```
- Both `cold` and `getTestScheduler` can be imported from `jasmine-marbles`.
    ```ts
    import { cold, getTestScheduler } from 'jasmine-marbles';
    ```
- More about marbles in the [official docs](https://rxjs.dev/guide/testing/marble-testing).
- Example file: [twain.component.spec.ts](./src/app/twain/twain.component.spec.ts)

### [Component with inputs and outputs :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#component-with-inputs-and-outputs)
- To trigger a click event while testing:
    * use `triggerEventHandler` if dealing with a `DebugElement`
    * use the native `click` event if dealing with an `HTMLElement`
    ```ts
    const de: DebugElement = fixture.debugElement.query(By.css('#button'));
    de.triggerEventHandler('click', null);

    const el: HTMLElement = de.nativeElement;
    el.click();
    ```
- These click events are automated in [this](./src/testing/index.ts) file.
- Example file: [dashboard-hero.component.spec.ts](./src/app/dashboard/dashboard-hero.component.spec.ts)

### [Component inside a test host :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#component-inside-a-test-host)
- A test host is a stripped-down version of a class that only contains properties required for the testing.
- Remember to add the test host to the `declarations` array while configuring the `TestBed`, and to pass the test host as the parameter while creating the component.
    ```ts
    TestBed.configureTestingModule({
        declarations: [ ActualComponent, TestHostComponent ]
    })
    fixture = TestBed.createComponent(TestHostComponent);
    ```
- Example file: [dashboard-hero.component.spec.ts](./src/app/dashboard/dashboard-hero.component.spec.ts)

### [Routing component :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#routing-component)
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
- Example file: [dashboard.component.spec.ts](./src/app/dashboard/dashboard.component.spec.ts)

### [Routed Component :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#routed-components)
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
- Activated route stub source: [link on angular.io](https://angular.io/guide/testing-components-scenarios#routed-components).
- Example file: [hero-detail.component.spec.ts](./src/app/hero/hero-detail.component.spec.ts)

### [Nested Component Tests :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#nested-component-tests)
- Shallow component testing: here, the code reduces the stubbing to only those components required in the component's test cases.
- **`NO_ERRORS_SCHEMA`** instructs the compiler to ignore the stubs not found during compilation.
    ```ts
    TestBed.configureTestingModule({
        schemas: [ NO_ERRORS_SCHEMA ],
        // ...
    })
    ```
- Do *not* overuse `NO_ERRORS_SCHEMA`, since the compiler will then be unable to tell you where the error is in case any interaction has happened with the ignored stubs.
- Example file: [app.component.spec.ts](./src/app/app.component.spec.ts)

### [Components with `RouterLink` :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#components-with-routerlink)
- I've used `RouterLinkDirectiveStub` as a ready-made stub of the `RouterLink` class.
- Source: [link on angular.io](https://angular.io/guide/testing-components-scenarios#components-with-routerlink)
- `By.directive(type)` can be used to fetch all injected elements of the specified type. Example:
    ```ts
    const routerLinks = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));  // replaced `type` with `RouterLinkDirectiveStub`
    ```
- Example file: [app.component.spec.ts](./src/app/app.component.spec.ts)

### [Use a `page` object :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#use-a-page-object)
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
- Example file: [hero-detail.component.spec.ts](./src/app/hero/hero-detail.component.spec.ts)

### [Using `compileComponents()` :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#calling-compilecomponents)
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
- Example files: [banner.component.spec.ts](./src/app/banner/banner.component.spec.ts), [hero-detail.component.spec.ts](./src/app/hero/hero-detail.component.spec.ts)

### [Module Imports :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#setup-with-module-imports)
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
- Example file: [hero-detail.component.spec.ts](./src/app/hero/hero-detail.component.spec.ts)

### [Override component providers :arrow_upper_right:](https://angular.io/guide/testing-components-scenarios#override-component-providers)
- If you want to create a _new_ spy, instead of spying on another method, instead of using `createSpyObject` or `spyOn`, use `jasmine.createSpy` method, like so:
    ```ts
    const spy = jasmine.createSpy('spyName');  // this can be chained with other methods like `and` and be provided w/ functionality accordingly
    ```
- Example file: [hero-detail.component.spec.ts](./src/app/hero/hero-detail.component.spec.ts)
