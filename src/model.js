const compartments = require('./compartments');
const staticData = require('./static-data');

module.exports = {
	gfLow: undefined,
	gfHigh: undefined,
	surfacePressure: undefined,
	levels: [],
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

		this.populateCompartments();

		return this;
	},

	addleg: function (endDepth, timePeriod, nitrogenFraction, heliumFraction){
		if (isNaN(endDepth) || isNaN(timePeriod) || isNaN(nitrogenFraction) || isNaN(heliumFraction)) {
			throw new TypeError('Parameter is not a number');
		}

		if (nitrogenFraction > 1 || nitrogenFraction < 0){
			throw new TypeError('Nitrogen gas faction must be between 0 and 1');
		}

		if (heliumFraction > 1 || heliumFraction < 0){
			throw new TypeError('Helium gas faction must be between 0 and 1');
		}

		this.levels.push({
			endDepth: endDepth,
			timePeriod: timePeriod,
			nitrogenFraction: nitrogenFraction,
			heliumFraction: heliumFraction,
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