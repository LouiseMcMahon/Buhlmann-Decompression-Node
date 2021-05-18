const compartments = require('./compartments');
const staticData = require('./static-data');

module.exports = {
	gfLow: undefined,
	gfHigh: undefined,
	surfacePressure: undefined,
	levels: [],
	gas: [],
	compartments: [],

	/**
     * Called to pass configuration variables for the model, should only be called once before computation
     *
     * @param gfLow Gradient factor low as percentage 0-1
     * @param gfHigh Gradient factor high as percentage 0-1
     * @param surfacePressure Dive site pressure in bar
     * @returns {exports}
     */
	configureModel: function(gfLow, gfHigh, surfacePressure) {
		if (isNaN(gfLow) || isNaN(gfHigh) || isNaN(surfacePressure)) {
			throw new TypeError('Parameter is not a number');
		}

		if (gfLow < 0 || gfLow > 1 || gfHigh < 0 || gfHigh > 1  ) {
			throw new TypeError('Gradient factors must be a percentage expressed as a number between 0 and 1');
		}

		this.gfLow = gfLow;
		this.gfHigh = gfHigh;
		this.surfacePressure = surfacePressure;

		return this;
	},

	addGas: function (oxygenPercent, heliumPercent){
		if (isNaN(oxygenPercent) || isNaN(heliumPercent)) {
			throw new TypeError('Parameter is not a number');
		}

		this.gas.push([oxygenPercent, heliumPercent]);

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
		});

		return this;

	},

	populateCompartments: function (){
		if(this.compartments.length > 0){
			throw new Error('Compartments are already populated');
		}

		let i = 0;
		while(i < 16){
			const compartment = Object.create(compartments);
			compartment.nitrogenCoefficientA = staticData.nitrogenCoefficientA[i];
			compartment.nitrogenCoefficientB = staticData.nitrogenCoefficientB[i];
			compartment.heliumCoefficientA = staticData.heliumCoefficientA[i];
			compartment.heliumCoefficientB = staticData.heliumCoefficientB[i];
			compartment.nitrogenHalfLife = staticData.nitrogenHalfLife[i];
			compartment.heliumHalfLife = staticData.heliumHalfLife[i];
			compartment.waterVapourPressure = staticData.waterVapourPressure;
			compartment.surfacePressure = this.surfacePressure;
			compartment.nitrogenPressure = staticData.initialNitrogenPressure * (this.surfacePressure - staticData.waterVapourPressure);
			compartment.heliumPressure = staticData.initialHeliumPressure;
			this.compartments.push(compartment);
			i++;
		}

		return this;
	},

	compute: function (){
		return this;
	}
};