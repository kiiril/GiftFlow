// Currency mapping utility
export const getCurrencySymbol = (currencyCode) => {
    const currencyMap = {
        'USD': '$',
        'EUR': '€',
        'RUB': '₽'
    };

    return currencyMap[currencyCode] || currencyCode;
};

