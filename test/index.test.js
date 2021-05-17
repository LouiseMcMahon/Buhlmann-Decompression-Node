const {expect} = require('chai');
const {describe} = require("mocha");
const index = require('../src/index')

describe('Index', function() {
    describe('Configure Model', function() {
        it('should set GF low and high in the model when called', function() {
            const model = index.configureModel(0,100, 50)
            expect(model.gfLow).to.be.equal(0)
            expect(model.gfHigh).to.be.equal(100)
            expect(model.altitude).to.be.equal(50)
        });

        it('should throw an error if gf low is not passed as a number', function() {
            expect(() => index.configureModel('a',100, 50)).to.throw()
        });

        it('should throw an error if gf high is not passed as a number', function() {
            expect(() => index.configureModel(0,'a', 50)).to.throw()
        });

        it('should throw an error if altitude is not passed as a number', function() {
            expect(() => index.configureModel(0,100, 'a')).to.throw()
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
});