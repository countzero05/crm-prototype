export const mapErrors = (data, err) => (
  {
    ...data,
    error: err.errors && Object.keys(err.errors).length ? Object.keys(err.errors).reduce((self, field) => {
        self[field] = err.errors[field].message;
        return self;
      }, {}) : err.message
  }
);