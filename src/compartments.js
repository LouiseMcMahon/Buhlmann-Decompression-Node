module.exports = {
	//static variables set inside the object for performance reasons
	waterVapourPressure: undefined,
	surfacePressure: undefined,

	//Current Pressures variables
	nitrogenPressure: undefined,
	heliumPressure: undefined,

	//Static calculation variables
	nitrogenCoefficientA: undefined,
	nitrogenCoefficientB: undefined,
	heliumCoefficientA: undefined,
	heliumCoefficientB: undefined,
	nitrogenHalfLife: undefined,
	heliumHalfLife: undefined,

	/**
	 * Updates the compartment pressures for the given dive leg.
	 *
	 * @param nitrogenContent fraction of nitrogen being breathed as a float between 0 and 1
	 * @param heliumContent fraction of helium being breathed as a float between 0 and 1
	 * @param currentDepth staring depth in meters
	 * @param targetDepth target depth in meters
	 * @param duration duration of dive leg in decimal minutes
	 */
	calculateCompartmentPressures: function (nitrogenContent, heliumContent, currentDepth, targetDepth, duration){
		this.nitrogenPressure = this.schreinerEquation(nitrogenContent, currentDepth, targetDepth, duration, this.nitrogenHalfLife, this.nitrogenPressure);
		this.heliumPressure = this.schreinerEquation(nitrogenContent, currentDepth, targetDepth, duration, this.heliumHalfLife, this.heliumPressure);
	},

	/**
	 * Caclulates and returns the output of the schreiner equation for a given inert gas dose not set anything
	 *
	 * @param inertGasFraction fraction of the chosen inert gas as a float between 0 and 1
	 * @param currentDepth staring depth in meters
	 * @param targetDepth target depth in meters
	 * @param duration duration of dive leg in decimal minutes
	 * @param gasHalfLife half life of the chosen inert gas
	 * @param gasCurrentPressure current compartment pressure of the chosen innert gas
	 * @returns {number}
	 */
	schreinerEquation: function (inertGasFraction, currentDepth, targetDepth, duration, gasHalfLife, gasCurrentPressure){
		const p_alv = inertGasFraction* ((currentDepth+10)/10 - this.waterVapourPressure);
		const k = Math.log(2)/gasHalfLife;
		const r = inertGasFraction * ((targetDepth-currentDepth)/10)/duration;

		return  p_alv + r * (duration - 1 / k) - (p_alv - gasCurrentPressure - r / k ) * Math.exp(-k * duration);
	},

	/**
	 * Returns the current max ascent pressure for this tissue compartment
	 * @param gradientFactor current gradient factor passed as a number between 0 and 1
	 * @returns {number}
	 */
	buhlmannEquation: function (gradientFactor) {
		const P = this.nitrogenPressure + this.heliumPressure;
		const A = (this.nitrogenCoefficientA * this.nitrogenPressure + this.heliumCoefficientA * this.heliumPressure) / P;
		const B = (this.nitrogenCoefficientB * this.nitrogenPressure + this.heliumCoefficientB * this.heliumPressure) / P;
		return (P - A * gradientFactor) / (gradientFactor / B + 1 - gradientFactor);
	}
};