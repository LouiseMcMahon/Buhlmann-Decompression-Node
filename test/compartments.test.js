const {expect} = require('chai');
const {describe} = require('mocha');
const compartments = require('../src/compartments');
const staticData = require('../src/static-data');
const surfacePressure = 1;

let compartment = compartments;

describe('Compartment', function() {
	beforeEach(() => {
		compartment = Object.create(compartments);
		compartment.nitrogenCoefficientA = staticData.nitrogenCoefficientA[0];
		compartment.nitrogenCoefficientB = staticData.nitrogenCoefficientB[0];
		compartment.heliumCoefficientA = staticData.heliumCoefficientA[0];
		compartment.heliumCoefficientB = staticData.heliumCoefficientB[0];
		compartment.nitrogenHalfLife = staticData.nitrogenHalfLife[0];
		compartment.heliumHalfLife = staticData.heliumHalfLife[0];
		compartment.waterVapourPressure = staticData.waterVapourPressure;
		compartment.surfacePressure = surfacePressure;
		compartment.nitrogenPressure = staticData.initialNitrogenPressure * (surfacePressure - staticData.waterVapourPressure);
		compartment.heliumPressure = staticData.initialHeliumPressure;
	});

	describe('Calculate Compartment Pressures', function () {
		it('Function should update compartment pressures', function () {
			compartment.calculateCompartmentPressures(0.50, 0.50, 0, 10, 5);
			compartment.calculateCompartmentPressures(0.50, 0.50, 10, 20, 5);

			expect(compartment.nitrogenPressure).to.equal(1.0416699778488399);
			expect(compartment.heliumPressure).to.equal(1.2482576450654272);
		});
	});

	describe('Schreiner Equation', function () {
		it('Schreiner equation should calculate correct compartment pressure', function () {
			expect(compartment.schreinerEquation(0.68, 0, 30, 1.5, compartment.nitrogenHalfLife, compartment.nitrogenPressure)).to.equal(0.960587365064689);
		});
	});


});