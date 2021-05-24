const {describe} = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const staticData = require('../src/static-data');

let model = require('../src/model');

chai.use(sinonChai);

describe('Model', function() {
	beforeEach(() => {
		delete require.cache[require.resolve('../src/model')];
		model = require('../src/model');
	});

	describe('Configure Model', function() {
		it('should set GF low and high in the model when called', function() {
			model.configureModel(0.5,0.7, 1);
			expect(model.gfLow).to.be.equal(0.5);
			expect(model.gfHigh).to.be.equal(0.7);
			expect(model.surfacePressure).to.be.equal(1);
		});

		it('should throw an error if gf low is not passed as a number between 0 and 1', function() {
			expect(() => model.configureModel('a',0.7, 1)).to.throw();
			expect(() => model.configureModel(-0.1,0.7, 1)).to.throw();
			expect(() => model.configureModel(1.1,0.7, 1)).to.throw();
		});

		it('should throw an error if gf high is not passed as a number between 0 and 1', function() {
			expect(() => model.configureModel(0.5,'a', 1)).to.throw();
			expect(() => model.configureModel(0.5,-0.1, 1)).to.throw();
			expect(() => model.configureModel(0.5,1.1, 1)).to.throw();

		});

		it('should throw an error if altitude is not passed as a number', function() {
			expect(() => model.configureModel(0.5,0.7, 'a')).to.throw();
		});

		it('should call populate compartments', function() {
			model.populateCompartments = sinon.fake();
			model.configureModel(0.5,0.7, 1);
			expect(model.populateCompartments).to.have.been.calledOnce;
		});


	});

	describe('Add Level', function() {
		it('should set a level in the model when called', function() {
			model.addleg(50,5, 0.21, 0)
				.addleg(100,5,0.10, 0)
				.addleg(0,5, 0.21, 0);

			const level = model.levels[0];
			expect(level.endDepth).to.be.equal(50);
			expect(level.timePeriod).to.be.equal(5);
			expect(level.nitrogenFraction).to.be.equal(0.21);
			expect(level.heliumFraction).to.be.equal(0);
			expect(level.userInput).to.be.equal(true);
		});


		it('should throw an error if end depth is not passed as a number', function() {
			expect(() => model.addleg('a',5)).to.throw();
		});

		it('should throw an error if time period is not passed as a number', function() {
			expect(() => model.addleg(0,'a')).to.throw();
		});

		it('should throw an error if nitrogen fraction is not passed as a number', function() {
			expect(() => model.addleg(0,5, 'a', 0)).to.throw();
		});

		it('should throw an error if helium fraction is not passed as a number', function() {
			expect(() => model.addleg(0,5, 21, 'a')).to.throw();
		});

		it('should throw an error if nitrogen fraction is not passed as a number bellow 1', function() {
			expect(() => model.addleg(0,5, 2, 0)).to.throw();
		});

		it('should throw an error if helium fraction is not passed as a bellow 1', function() {
			expect(() => model.addleg(0,5, 21, 2)).to.throw();
		});

		it('should throw an error if nitrogen fraction is not passed as a number above 0', function() {
			expect(() => model.addleg(0,5, -1, 0)).to.throw();
		});

		it('should throw an error if helium fraction is not passed as a above 0', function() {
			expect(() => model.addleg(0,5, 21, -1)).to.throw();
		});
	});

	describe('Populate Compartments', function() {
		it('should populate compartments', function() {
			model.surfacePressure = 1000;
			model.populateCompartments();

			expect(model.compartments).to.have.lengthOf(16);

			const compartment0 = model.compartments[0];
			expect(compartment0.nitrogenCoefficientA).to.be.equal(staticData.nitrogenCoefficientA[0]);
			expect(compartment0.nitrogenCoefficientB).to.be.equal(staticData.nitrogenCoefficientB[0]);
			expect(compartment0.heliumCoefficientA).to.be.equal(staticData.heliumCoefficientA[0]);
			expect(compartment0.heliumCoefficientB).to.be.equal(staticData.heliumCoefficientB[0]);
			expect(compartment0.nitrogenHalfLife).to.be.equal(staticData.nitrogenHalfLife[0]);
			expect(compartment0.heliumHalfLife).to.be.equal(staticData.heliumHalfLife[0]);
			expect(compartment0.waterVapourPressure).to.be.equal(staticData.waterVapourPressure);
			expect(compartment0.surfacePressure).to.be.equal(model.surfacePressure);
			expect(compartment0.nitrogenPressure).to.be.equal(staticData.initialNitrogenPressure * (model.surfacePressure - staticData.waterVapourPressure));
			expect(compartment0.heliumPressure).to.be.equal(staticData.initialHeliumPressure);
		});

		it('should not populate compartments when compartments are already set', function() {
			model.populateCompartments();
			expect(model.populateCompartments).to.throw();
		});
	});
});