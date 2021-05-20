/**
 * Water vabour pressure source https://github.com/gully/decotengu/blob/master/decotengu/const.py
 * Bulman static data source https://github.com/gully/decotengu/blob/master/decotengu/model.py
 */

module.exports = {
	waterVapourPressure: 0.0627,
	initialNitrogenPressure: 0.7902,
	initialHeliumPressure: 0,
	nitrogenCoefficientA : [
		1.2599, 1.0000, 0.8618, 0.7562, 0.6200, 0.5043, 0.4410, 0.4000,
		0.3750, 0.3500, 0.3295, 0.3065, 0.2835, 0.2610, 0.2480, 0.2327,
	],
	nitrogenCoefficientB: [
		0.5050, 0.6514, 0.7222, 0.7825, 0.8126, 0.8434, 0.8693, 0.8910,
		0.9092, 0.9222, 0.9319, 0.9403, 0.9477, 0.9544, 0.9602, 0.9653,
	],
	heliumCoefficientA: [
		1.7424, 1.3830, 1.1919, 1.0458, 0.9220, 0.8205, 0.7305, 0.6502,
		0.5950, 0.5545, 0.5333, 0.5189, 0.5181, 0.5176, 0.5172, 0.5119,
	],
	heliumCoefficientB: [
		0.4245, 0.5747, 0.6527, 0.7223, 0.7582, 0.7957, 0.8279, 0.8553,
		0.8757, 0.8903, 0.8997, 0.9073, 0.9122, 0.9171, 0.9217, 0.9267,
	],
	nitrogenHalfLife: [
		4.0, 8.0, 12.5, 18.5, 27.0, 38.3, 54.3, 77.0, 109.0,
		146.0, 187.0, 239.0, 305.0, 390.0, 498.0, 635.0,
	],
	heliumHalfLife: [
		1.51, 3.02, 4.72, 6.99, 10.21, 14.48, 20.53, 29.11, 41.20,
		55.19, 70.69, 90.34, 115.29, 147.42, 188.24, 240.03,
	],
};