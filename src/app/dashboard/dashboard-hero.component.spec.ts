import { DashboardHeroComponent } from './dashboard-hero.component';
import { Hero } from '../model/hero';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

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

        expectedHero = {id: 42, name: 'Tes name'};
        comp.hero = expectedHero;
        
        fixture.detectChanges();
    });

    it('should display hero name in upper case', () => {
        const expectedPipedName = expectedHero.name.toUpperCase();
        expect(heroEl.textContent).toContain(expectedPipedName);
    });
});
