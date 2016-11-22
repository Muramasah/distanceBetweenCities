// begins program
readCities();

/**
 * Reads in cities from .txt file, then calls assignCityCoords
 * @return {Array} cities
 */
function readCities() {
    var fs = require('fs');
    fs.readFile('./cities.txt', function(err, data) {
        if (err) {
            throw new Error(err);
        }
        else {
            var cities = data.toString().split('\n');
            cities.forEach(function(city, i, cities) {
                cities[i] = {name: city, coordinates: null};
            });
            assignCityCoords(cities);
            return cities;
        }
    });
}

/**
 * Finds each city's coordinates based on city name, then calls compareDistances
 * @param {Array} cities (just names)
 * @return {Promise} Array of cities (names and coordinates) - for testing
 */
function assignCityCoords(cities) {
    var Promise = require('bluebird');
    var config = require('./config.js');
    var googleMapsClient = require('@google/maps').createClient({
      key: config.GOOGLE,
      Promise: Promise
    });
    var coordPromises = [];

    if (cities.length < 2) {
        throw new Error('Please specify 2 or more cities!');
    }

    // promisifies each API call and adds it to array
    for (var i = 0; i < cities.length; i++) {
        coordPromises.push(googleMapsClient.geocode({
                address: cities[i].name
        }).asPromise());
    }

    // makes API calls/resolves all promises, then calls compareDistances function
    return Promise.all(coordPromises)
    .then(function(response) {
        response.forEach(function(cityData, i) {
            if (!cityData.json.results[0]) {
                throw new Error(cities[i].name + " is not a valid city. Please remove this city and try again.");
            }
            cities[i].coordinates = cityData.json.results[0].geometry.location;
        });
        compareDistances(cities);
        return cities;
    })
    .catch(function(err) { throw new Error(err) });
}

/**
 * Finds the two cities with the minimum distance between them, then calls print function
 * @param {Array} city objects
 * @return {2D Array} city object tuples - for testing
 */
function compareDistances(cities) {
    var geolib = require('geolib');
    var halfOfEarthsCircumference = 20000000; // the furthest apart any cities could possibly be (in meters)
    var minDistance = halfOfEarthsCircumference;
    var minCities = [];

    // compares distance to the minimum distance so far, determines minCities
    for (var i = 0; i < cities.length - 1; i++) {
        for (var j = i + 1; j < cities.length; j++) {
            var distance = geolib.getDistance({latitude: cities[i].coordinates.lat, longitude: cities[i].coordinates.lng}, {latitude: cities[j].coordinates.lat, longitude: cities[j].coordinates.lng});
            if (distance < minDistance) {
                minDistance = distance;
                minCities = [[cities[i], cities[j]]];
            }
            else if (distance === minDistance) {
                minCities.push([cities[i], cities[j]]);
            }
        }
    }
    printCities(minCities);
    return minCities;
}

/**
 * Prints city names - will print multiple lines if there is more than one pair that has the same distance apart
 * @param {2D Array} city object tuples
 */
function printCities(cityTuples) {
    cityTuples.forEach(function(tuple, i) {
        console.log(cityTuples[i][0].name, 'and', cityTuples[i][1].name);
    });
}

// for testing purposes
module.exports = {
    readCities: readCities,
    assignCityCoords: assignCityCoords,
    compareDistances: compareDistances,
    printCities: printCities
};
