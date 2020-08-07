import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HeroService } from './hero.service';
import { asyncData, asyncError } from '../../testing/async-observable-helpers';

describe('HttpServices (with spies)', () => {
    let heroService: HeroService;
    let httpClientSpy: { get: jasmine.Spy };

    const expectedHeroes = [
        { id: 11, name: 'Dr Nice' },
        { id: 12, name: 'Narco' },
        { id: 13, name: 'Bombasto' },
        { id: 14, name: 'Celeritas' },
        { id: 15, name: 'Magneta' },
        { id: 16, name: 'RubberMan' },
        { id: 17, name: 'Dynama' },
        { id: 18, name: 'Dr IQ' },
        { id: 19, name: 'Magma' },
        { id: 20, name: 'Tornado' }
      ];

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        heroService = new HeroService(httpClientSpy as any);
    });

    it('should return expected heroes', () => {
        httpClientSpy.get.and.returnValue(asyncData(expectedHeroes));

        heroService.getHeroes().subscribe(heroes => {
            expect(heroes).toEqual(expectedHeroes, 'expected heroes');
        });

        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    });

    it('should return an error when the server returns a 404', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'test 404 error',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        heroService.getHeroes().subscribe(
            heroes => {
                fail('expected an error, not heroes');
                done();
            },
            error => {
                expect(error.message).toContain('test 404 error');
                done();
            }
        );
    });
});
