const rental = require('./rentalPrice');

// Test constants (business-rule based)
const DATE_LOW_SEASON = new Date('2025-01-01');
const DATE_HIGH_SEASON = new Date('2025-07-01');
const DATE_HIGH_SEASON_ALT = new Date('2025-06-01');

const ONE_DAY_LATER_LOW = new Date('2025-01-15');

const AGE_UNDER_MIN = 17;
const AGE_YOUNG_DRIVER = 20;
const AGE_ADULT = 30;
const AGE_RACER_YOUNG = 25;

const LICENSE_TOO_NEW = 0.5;
const LICENSE_UNDER_2_YEARS = 1.5;
const LICENSE_UNDER_3_YEARS = 2;
const LICENSE_EXPERIENCED = 5;

describe('Rental price calculation', () => {

  test('Driver under minimum age cannot rent', () => {
    expect(() =>
      rental.price(
        DATE_LOW_SEASON,
        DATE_LOW_SEASON,
        'Compact',
        AGE_UNDER_MIN,
        LICENSE_EXPERIENCED
      )
    ).toThrow('Driver too young');
  });

  test('Young drivers can only rent Compact cars', () => {
    expect(() =>
      rental.price(
        DATE_LOW_SEASON,
        DATE_LOW_SEASON,
        'Racer',
        AGE_YOUNG_DRIVER,
        LICENSE_EXPERIENCED
      )
    ).toThrow('only rent Compact');
  });

  test('Driver with too new license cannot rent', () => {
    expect(() =>
      rental.price(
        DATE_LOW_SEASON,
        DATE_LOW_SEASON,
        'Compact',
        AGE_ADULT,
        LICENSE_TOO_NEW
      )
    ).toThrow('license held for less than one year');
  });

  test('Base daily price equals driver age', () => {
    const result = rental.price(
      DATE_LOW_SEASON,
      DATE_LOW_SEASON,
      'Compact',
      AGE_ADULT,
      LICENSE_EXPERIENCED
    );

    expect(result).toBe('$30.00');
  });

  test('High season increases price by seasonal percentage', () => {
    const result = rental.price(
      DATE_HIGH_SEASON_ALT,
      DATE_HIGH_SEASON_ALT,
      'Compact',
      AGE_YOUNG_DRIVER,
      LICENSE_EXPERIENCED
    );

    expect(result).toBe('$23.00');
  });

  test('Racer with young driver costs more in high season', () => {
    const result = rental.price(
      DATE_HIGH_SEASON,
      DATE_HIGH_SEASON,
      'Racer',
      AGE_RACER_YOUNG,
      LICENSE_EXPERIENCED
    );

    expect(result).toBe('$43.13');
  });

  test('Short license increases rental price', () => {
    const result = rental.price(
      DATE_LOW_SEASON,
      DATE_LOW_SEASON,
      'Compact',
      AGE_YOUNG_DRIVER,
      LICENSE_UNDER_2_YEARS
    );

    expect(result).toBe('$26.00');
  });

  test('Short license adds extra fee in high season', () => {
    const result = rental.price(
      DATE_HIGH_SEASON,
      DATE_HIGH_SEASON,
      'Compact',
      AGE_YOUNG_DRIVER,
      LICENSE_UNDER_3_YEARS
    );

    expect(result).toBe('$38.00');
  });

  test('Long rental gets discount in low season', () => {
    const result = rental.price(
      DATE_LOW_SEASON,
      ONE_DAY_LATER_LOW,
      'Compact',
      AGE_ADULT,
      LICENSE_EXPERIENCED
    );

    expect(result).toBe('$405.00');
  });

  test('Unknown car class is treated as valid but non-special', () => {
    const result = rental.price(
      DATE_LOW_SEASON,
      DATE_LOW_SEASON,
      'Truck',
      AGE_ADULT,
      LICENSE_EXPERIENCED
    );

    expect(result).toBe('$30.00');
  });

});
