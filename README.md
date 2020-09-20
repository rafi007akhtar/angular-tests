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
