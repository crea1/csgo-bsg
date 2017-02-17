[![Build Status](https://travis-ci.org/crea1/csgo-bsg.svg?branch=develop)](https://travis-ci.org/crea1/csgo-bsg)[![Code Climate](https://codeclimate.com/github/crea1/csgo-bsg/badges/gpa.svg)](https://codeclimate.com/github/crea1/csgo-bsg)
# csgo-bsg

### Install gulp and bower
```bash
# Gulp
npm install --global gulp

# Bower
npm install --global bower

# Node modules
npm install
```


### Building 
```bash
bower install
gulp
```

### Development

To run live reload of code use

```bash
gulp reload
```

### Release

This builds the project in build folder, and makes a zip file located under dist folder.

```bash
gulp release:dev
# or
gulp release:prod
# Prepare next development iteration
gulp version:pre
```
