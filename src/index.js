module.exports = {
    gfLow: undefined,
    gfHigh: undefined,
    altitude: undefined,
    levels: [],
    gas: [],
    compartments: [],

    configureModel: function(gfLow, gfHigh, altitude) {
        if (isNaN(gfLow) || isNaN(gfHigh) || isNaN(altitude)) {
            throw new TypeError('Parameter is not a number');
        }

        this.gfLow = gfLow;
        this.gfHigh = gfHigh;
        this.altitude = altitude

        return this;
    },

    addGas: function (o2Percent, hePercent){
        if (isNaN(o2Percent) || isNaN(hePercent)) {
            throw new TypeError('Parameter is not a number');
        }

        this.gas.push([o2Percent, hePercent])

        return this;
    },

    addLevel: function (endDepth, timePeriod){
        if (isNaN(endDepth) || isNaN(timePeriod)) {
            throw new TypeError('Parameter is not a number');
        }

        this.levels.push({
            endDepth: endDepth,
            timePeriod: timePeriod,
            userInput: true
        })

        return this;

    },

    compute: function (){

        return this;

    }
}