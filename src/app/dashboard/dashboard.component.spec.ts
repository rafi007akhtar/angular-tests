import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HeroService } from '../model/hero.service';
import { Router } from '@angular/router';
import { Hero } from '../model/hero';

describe('DashboardComponent routing component', () => {
    let comp: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(() => {
        const heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            declarations: [ DashboardComponent ],
            providers: [
                { provide: HeroService, useValue: heroServiceSpy },  // providing spy object as stub
                { provide: Router, useValue: routerSpy }
            ]
        });

        fixture = TestBed.createComponent(DashboardComponent);
        comp = fixture.componentInstance;
    });

    it('should tell ROUTER to navigate when hero clicked', () => {
        // NOTE: I didn't really understand how this spec was tested in the docs,
        // hence, I am testing it in a simpler way

        const hero: Hero = { id: 42, name: 'Test Hero' };
        comp.gotoDetail(hero);
        const url = `/heroes/${hero.id}`;
        expect(comp['router'].navigateByUrl).toHaveBeenCalledWith(url);
    });
});
