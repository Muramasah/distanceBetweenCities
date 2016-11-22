# Finding Two Closest Cities

To run the program, first ensure you have node installed. Then `git clone` the repo to your local filesystem and `npm install`.
Also ensure you have jasmine-node installed globally: `npm install -g jasmine-node`.

Add a file to the root folder called config.js and export your Google Maps API Key: 
`module.exports = {
	GOOGLE: <<your API key here>>
}`

The program may then be run through the terminal with `node distanceBetweenCities.js`.
Tests may be run through the terminal via `jasmine-node cities.spec.js --verbose`.  

To add or change the cities to be included, edit cities.txt.