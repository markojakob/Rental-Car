// Constants
const MIN_DRIVER_AGE = 18;
const YOUNG_DRIVER_MAX_AGE = 21;
const RACER_YOUNG_MAX_AGE = 25;

const HIGH_SEASON_START_MONTH = 3; // April (0-based)
const HIGH_SEASON_END_MONTH = 9;   // October

const HIGH_SEASON_PRICE_INCREASE = 0.15;
const LONG_RENT_DISCOUNT = 0.10;
const RACER_YOUNG_HIGH_SEASON_MULTIPLIER = 1.5;

const LICENSE_MIN_YEARS = 1;
const LICENSE_PRICE_INCREASE_YEARS = 2;
const LICENSE_HIGH_SEASON_FEE_YEARS = 3;

const LICENSE_PRICE_MULTIPLIER = 1.3;
const LICENSE_HIGH_SEASON_EXTRA_FEE = 15;

// Main function
function price(
  pickupDate,
  dropoffDate,
  type,
  age,
  licenseYears
) {
  const carClass = getCarClass(type);
  const rentalDays = calculateDays(pickupDate, dropoffDate);
  const season = getSeason(pickupDate, dropoffDate);

  validateDriver(age, carClass, licenseYears);

  let dailyPrice = calculateBaseDailyPrice(age, season, carClass);
  dailyPrice = applyLicenseRules(dailyPrice, licenseYears, season);

  let totalPrice = dailyPrice * rentalDays;
  totalPrice = applyRentalLengthDiscount(totalPrice, rentalDays, season);

  return `$${totalPrice.toFixed(2)}`;
}

// Validation
function validateDriver(age, carClass, licenseYears) {
  if (age < MIN_DRIVER_AGE) {
    throw new Error("Driver too young - cannot quote the price");
  }

  if (age <= YOUNG_DRIVER_MAX_AGE && carClass !== "Compact") {
    throw new Error("Drivers 21 y/o or less can only rent Compact vehicles");
  }

  if (licenseYears < LICENSE_MIN_YEARS) {
    throw new Error("Driver's license held for less than one year");
  }
}

// Pricing helpers
function calculateBaseDailyPrice(age, season, carClass) {
  let price = age; // minimum daily price = driver's age

  if (
    carClass === "Racer" &&
    age <= RACER_YOUNG_MAX_AGE &&
    season === "High"
  ) {
    price *= RACER_YOUNG_HIGH_SEASON_MULTIPLIER;
  }

  if (season === "High") {
    price *= 1 + HIGH_SEASON_PRICE_INCREASE;
  }

  return price;
}

function applyLicenseRules(price, licenseYears, season) {
  let adjustedPrice = price;

  if (licenseYears < LICENSE_PRICE_INCREASE_YEARS) {
    adjustedPrice *= LICENSE_PRICE_MULTIPLIER;
  }

  if (
    licenseYears < LICENSE_HIGH_SEASON_FEE_YEARS &&
    season === "High"
  ) {
    adjustedPrice += LICENSE_HIGH_SEASON_EXTRA_FEE;
  }

  return adjustedPrice;
}

function applyRentalLengthDiscount(totalPrice, days, season) {
  if (days > 10 && season === "Low") {
    return totalPrice * (1 - LONG_RENT_DISCOUNT);
  }
  return totalPrice;
}

function getCarClass(type) {
  const allowedClasses = ["Compact", "Electric", "Cabrio", "Racer"];
  return allowedClasses.includes(type) ? type : "Unknown";
}

function calculateDays(pickupDate, dropoffDate) {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const start = new Date(pickupDate);
  const end = new Date(dropoffDate);

  return Math.round(Math.abs((end - start) / ONE_DAY_MS)) + 1;
}

function getSeason(pickupDate, dropoffDate) {
  const pickupMonth = new Date(pickupDate).getMonth();
  const dropoffMonth = new Date(dropoffDate).getMonth();

  const isHighSeason =
    (pickupMonth >= HIGH_SEASON_START_MONTH &&
      pickupMonth <= HIGH_SEASON_END_MONTH) ||
    (dropoffMonth >= HIGH_SEASON_START_MONTH &&
      dropoffMonth <= HIGH_SEASON_END_MONTH);

  return isHighSeason ? "High" : "Low";
}

exports.price = price;
