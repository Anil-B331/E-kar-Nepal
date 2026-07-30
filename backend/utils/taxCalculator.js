const calculateVehicleTax = (engineCc, category) => {
    let baseTax = 0;
    
    if (category === '2W') {
        if (engineCc <= 125) baseTax = 3000;
        else if (engineCc <= 150) baseTax = 5000;
        else if (engineCc <= 250) baseTax = 6500;
        else if (engineCc <= 400) baseTax = 11000;
        else baseTax = 20000;
    } else if (category === '4W') {
        if (engineCc <= 1000) baseTax = 22000;
        else if (engineCc <= 1500) baseTax = 25000;
        else if (engineCc <= 2000) baseTax = 27000;
        else if (engineCc <= 2500) baseTax = 35000;
        else if (engineCc <= 2900) baseTax = 40000;
        else baseTax = 60000;
    } else {
        baseTax = 5000; // Default fallback
    }

    // A real implementation would apply late fees based on a last_paid_date.
    // For MVP, we will just return the base calculated tax.
    return baseTax;
};

const calculateLandTax = (areaSqm, category) => {
    let baseRatePerSqm = 0;

    if (category === 'Residential') {
        baseRatePerSqm = 50; // Rs 50 per sq meter
    } else if (category === 'Agricultural') {
        baseRatePerSqm = 10; // Rs 10 per sq meter
    } else if (category === 'Commercial') {
        baseRatePerSqm = 150; // Rs 150 per sq meter
    } else {
        baseRatePerSqm = 20; // Default
    }

    return areaSqm * baseRatePerSqm;
};

module.exports = {
    calculateVehicleTax,
    calculateLandTax
};
