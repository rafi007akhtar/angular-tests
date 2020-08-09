import { DashboardHeroComponent } from './dashboard-hero.component';
import { Hero } from '../model/hero';

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
