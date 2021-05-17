const {expect} = require('chai');
const {describe} = require("mocha");
const index = require('../src/index')
const static = require('../src/static')

describe('Index', function() {
    beforeEach(() => {
        index.gfLow = undefined;
        index.gfHigh = undefined;
        index.surfacePressure = undefined;
        index.levels = [];
        index.gas = [];
        index.compartments = [];
    });

    describe('Configure Model', function() {
        it('should set GF low and high in the model when called', function() {
            const model = index.configureModel(0.5,0.7, 1)
            expect(model.gfLow).to.be.equal(0.5)
            expect(model.gfHigh).to.be.equal(0.7)
            expect(model.surfacePressure).to.be.equal(1)
        });

        it('should throw an error if gf low is not passed as a number between 0 and 1', function() {
            expect(() => index.configureModel('a',0.7, 1)).to.throw()
            expect(() => index.configureModel(-0.1,0.7, 1)).to.throw()
            expect(() => index.configureModel(1.1,0.7, 1)).to.throw()

        });

        it('should throw an error if gf high is not passed as a number between 0 and 1', function() {
            expect(() => index.configureModel(0.5,'a', 1)).to.throw()
            expect(() => index.configureModel(0.5,-0.1, 1)).to.throw()
            expect(() => index.configureModel(0.5,1.1, 1)).to.throw()

        });

        it('should throw an error if altitude is not passed as a number', function() {
            expect(() => index.configureModel(0.5,0.7, 'a')).to.throw()
        });

    });

    describe('Add Gas', function() {
        it('should set the gas on the model when called', function() {
            const model = index.addGas(20,30)
                .addGas(50,0)
                .addGas(100,0)
            expect(model.gas[0]).to.deep.equal([20,30])
            expect(model.gas[1]).to.deep.equal([50,0])
            expect(model.gas[2]).to.deep.equal([100,0])
            expect(model.gas).to.have.lengthOf(3)
        });

        it('should throw an error if gf low is not passed as a number', function() {
            expect(() => index.addGas('a',0)).to.throw()
        });

        it('should throw an error if gf high is not passed as a number', function() {
            expect(() => index.addGas(0,'a')).to.throw()
        });
    });

    describe('Add Level', function() {
        it('should set a level in the model when called', function() {
            const model = index.addLevel(50,5)
                .addLevel(100,5)
                .addLevel(0,5)

            const level = model.levels[0]
            expect(level.endDepth).to.be.equal(50)
            expect(level.timePeriod).to.be.equal(5)
            expect(level.userInput).to.be.equal(true)
        });


        it('should throw an error if end depth is not passed as a number', function() {
            expect(() => index.addLevel('a',5)).to.throw()
        });

        it('should throw an error if time period is not passed as a number', function() {
            expect(() => index.addLevel(0,'a')).to.throw()
        });
    });

    describe('Populate Compartments', function() {
        it('should populate compartments', function() {
            const model = index
            model.surfacePressure = 1000
            model.populateCompartments()

            expect(model.compartments).to.have.lengthOf(16)

            const compartment0 = model.compartments[0]
            expect(compartment0.nitrogenCoefficientA).to.be.equal(static.nitrogenCoefficientA[0])
            expect(compartment0.nitrogenCoefficientB).to.be.equal(static.nitrogenCoefficientB[0])
            expect(compartment0.heliumCoefficientA).to.be.equal(static.heliumCoefficientA[0])
            expect(compartment0.heliumCoefficientB).to.be.equal(static.heliumCoefficientB[0])
            expect(compartment0.nitrogenHalfLife).to.be.equal(static.nitrogenHalfLife[0])
            expect(compartment0.heliumHalfLife).to.be.equal(static.heliumHalfLife[0])
            expect(compartment0.waterVapourPressure).to.be.equal(static.waterVapourPressure)
            expect(compartment0.surfacePressure).to.be.equal(model.surfacePressure)
            expect(compartment0.nitrogenPressure).to.be.equal(static.initialNitrogenPressure * (model.surfacePressure - static.waterVapourPressure))
            expect(compartment0.heliumPressure).to.be.equal(static.initialHeliumPressure)
        });

        it('should not populate compartments when compartments are already set', function() {
            const model = index.populateCompartments()

            expect(model.populateCompartments).to.throw();

        });
    });
});