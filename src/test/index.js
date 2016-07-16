function wrapAsync(fn) {
  return async (done) => {
    try {
      await fn();
      done();
    } catch (e) {
      done(e);
    }
  };
}

export default {
  wrapAsync,
};
