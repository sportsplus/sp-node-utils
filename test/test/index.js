import { expect } from 'chai';
import { stub, spy } from 'sinon';

import test from '../../src/test/index';

describe('test', () => {
  describe('wrapAsync', () => {
    const fn = spy(async () => {});
    const doneFn = stub();

    afterEach(() => {
      fn.reset();
      doneFn.reset();
    });

    it('should return function', () => {
      const res = test.wrapAsync();

      expect(res).to.be.a('function');
    });

    describe('return value', () => {
      it('should return promise', () => {
        const promise = test.wrapAsync(fn)(doneFn);

        expect(promise).to.be.a('promise');
      });

      it('should execute fn and done', (done) => {
        const promise = test.wrapAsync(fn)(doneFn);

        promise
          .then(() => {
            expect(fn.callCount).to.be.equal(1);
            expect(doneFn.callCount).to.be.equal(1);
            done();
          })
        .catch((e) => {
          done(e);
        })
      });

      it('should execute done with Error when fn throws error', (done) => {
        const error = new Error('Error on eFn');
        const eFn = spy(async () => { throw error });
        const promise = test.wrapAsync(eFn)(doneFn);

        promise
          .then(() => {
            expect(eFn.callCount).to.be.equal(1);
            expect(doneFn.callCount).to.be.equal(1);
            expect(doneFn.args[0][0]).to.be.a('error');
            expect(doneFn.args[0][0].message).to.be.equal(error.message);
            done();
          })
        .catch((e) => {
          done(e);
        })
      });
    });
  });
});
