const SafeMathLib = artifacts.require("SafeMathLibMock");

contract("SafeMathLib", accounts => {
  const MAX_UINT = 2 ** 256;
  let safeMathLib;

    beforeEach(async () => {
    safeMathLib = await SafeMathLib.new();
  });

  describe("multiply", () => {
    it("does not allow overflow", async () => {
      const a = MAX_UINT;
      const b = 10;

      try {
        await safeMathLib.multiply(a, b);
        assert.fail();
      } catch (err) {
        assert.isOk(/revert/.test(err.message));
      }
    });

    it("should return 0 when multiplicand is 0", async () => {
      const a = 0;
      const b = 10;

      const productBigNum = await safeMathLib.multiply(a, b);
      const product = productBigNum.toNumber();
      const expected = a * b;

      assert.equal(product, expected);
    });
  });

  describe("subtract", () => {
    it("does not allow subtrahend to be greater than minuend", async () => {
      const a = 5;
      const b = 7;

      try {
        await safeMathLib.subtract(a, b);
        assert.fail();
      } catch (err) {
        assert.isOk(/revert/.test(err.message));
      }
    });
  });

  describe("add", () => {
    it("does not allow overflow", async () => {
      const a = MAX_UINT;
      const b = 10;

      try {
        await safeMathLib.add(a, b);
        assert.fail();
      } catch (err) {
        assert.isOk(/revert/.test(err.message));
      }
    });
  });

  describe("divide", () => {
    it("does not allow divisor to be zero or less", async () => {
      const a = 10;
      const b = 0;

      try {
        await safeMathLib.divide(a, b);
        assert.fail();
      } catch (err) {
        assert.isOk(/revert/.test(err.message));
      }
    });
  });
});