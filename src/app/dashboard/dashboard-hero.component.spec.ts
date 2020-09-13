import { DashboardHeroComponent } from './dashboard-hero.component';
import { Hero } from '../model/hero';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { click } from 'src/testing';

describe('DashboardHeroComponent (class only)', () => {
    it('raises the selected event when clicked', () => {
        const comp = new DashboardHeroComponent();
        const hero: Hero = { id: 42, name: 'Test' };
        comp.hero = hero;

        comp.selected.subscribe((selectedHero: Hero) => {
            expect(selectedHero).toEqual(comp.hero);
        });
        comp.click();
    });
});

describe('DashboardHeroComponent when tested directly', () => {
    let comp: DashboardHeroComponent;
    let fixture: ComponentFixture<DashboardHeroComponent>;
    let heroEl: HTMLElement;
    let heroDe: DebugElement;
    let expectedHero: Hero;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ DashboardHeroComponent ]
        });

        fixture = TestBed.createComponent(DashboardHeroComponent);
        comp = fixture.componentInstance;

        heroDe = fixture.debugElement.query(By.css('.hero'));
        heroEl = heroDe.nativeElement;

        expectedHero = {id: 42, name: 'Test name'};
        comp.hero = expectedHero;
        
        fixture.detectChanges();
    });

    it('should display hero name in upper case', () => {
        const expectedPipedName = expectedHero.name.toUpperCase();
        expect(heroEl.textContent).toContain(expectedPipedName);
    });

    it('should raise selected event when clicked (triggerEventHandler)', () => {
        let selectedHero: Hero;
        comp.selected.subscribe((hero: Hero) => selectedHero = hero);

        heroDe.triggerEventHandler('click', null);  // Remember: for DebugElements, use triggerEventHandler
        expect(selectedHero).toBe(expectedHero);
    });

    it('should raise selected event when clicked (event.click)', () => {
        let selectedHero: Hero;
        comp.selected.subscribe((hero: Hero) => selectedHero = hero);

        heroEl.click();  // Remember: for HTMLElements you can use their native click events
        expect(selectedHero).toBe(expectedHero);
    });

    it('should raise selected event when clicked', () => {
        let selectedHero: Hero;
        comp.selected.subscribe((hero: Hero) => selectedHero = hero);

        click(heroDe);  // helper method will BTS call the triggerEventHandler since this is DebugElement
        click(heroEl);  // helper method will BTS call the native click event since this is HTMLElement

        expect(selectedHero).toBe(expectedHero);
    });
});

describe('DashboardHeroComponent when inside a test host', () => {
    // uses the TestHeroComponent from below
    let fixture: ComponentFixture<TestHeroComponent>;
    let heroEl: HTMLElement;
    let heroDe: DebugElement;
    let testHost: TestHeroComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ DashboardHeroComponent, TestHeroComponent ]
        });

        fixture = TestBed.createComponent(TestHeroComponent);
        testHost = fixture.componentInstance;
        heroDe = fixture.debugElement.query(By.css('.hero'));
        heroEl = heroDe.nativeElement;

        fixture.detectChanges();
    });

    it('should display hero name in upper case', () => {
        const expectedPipedName = testHost.hero.name.toUpperCase();
        expect(heroEl.textContent).toContain(expectedPipedName);
    });

    it('should raise selected event when clicked', () => {
        click(heroEl);
        expect(testHost.selectedHero).toBe(testHost.hero);
    });
});

// Test host component - begins
import { Component } from '@angular/core';

@Component({
    template: `
        <dashboard-hero
        [hero]=hero (selected)="onSelected($event)" >
        </dashboard-hero>
    `
})
class TestHeroComponent {
    // a clean stub for the DashboardHero component, like the Dashboard component, but without its dependencies
    hero: Hero = {id: 42, name: 'Test name'};
    selectedHero: Hero;
    onSelected(hero: Hero) {
        this.selectedHero = hero;
    }
}
// Test host component - ends
