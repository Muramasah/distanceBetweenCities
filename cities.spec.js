var distanceFuncs = require('./distanceBetweenCities.js');

describe('City name to coordinate conversion', function () {

    it('correctly assigns latitude and longitude values', function(done) {
        var coordsPromise = distanceFuncs.assignCityCoords([{name: 'Copenhagen', coordinates: null}, {name: 'Aarhus', coordinates: null}]);
        coordsPromise.then(function(coords) {
            expect(coords[0].coordinates.lat).toBe(55.6760968);
            expect(coords[0].coordinates.lng).toBe(12.5683371);
            expect(coords[1].coordinates.lat).toBe(56.162939);
            expect(coords[1].coordinates.lng).toBe(10.203921);
            done();
        });
    });

});

describe('Distance calculator', function() {

    var city1 = {name: 'Aarhus', coordinates: {lat: 56.162939, lng: 10.203921}};
    var city2 = {name: 'London', coordinates: {lat: 51.5073509, lng: -0.1277583}};
    var city3 = {name: 'Sydney', coordinates: {lat: -33.8688197, lng: 151.2092955}};

    it('correctly determines closest cities', function() {
        var result = distanceFuncs.compareDistances([city1, city2, city3]);
        expect(result.length).toBe(1);
        expect(result[0][0].name).toBe('Aarhus');
        expect(result[0][1].name).toBe('London');
    });

    it('can handle when more than two cities are the same distance apart', function() {
        var result = distanceFuncs.compareDistances([city2, city2, city2]);
        expect(result.length).toBe(3);
    });

});

describe('Print function', function() {

    it('console.logs city names', function() {
        console.log = jasmine.createSpy('log');
        distanceFuncs.printCities([[{name: 'City One'}, {name: 'City Two'}]])
        expect(console.log).toHaveBeenCalled();
    });

});
