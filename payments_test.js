Feature('Scenario of payments page checkings').retry(3);

// Checking that Moscow is the default region on the communal payments page, otherwise Moscow is
// selecting from the list of regions

Scenario('Checking region - Moscow', async (I) => {
    I.amOnPage('https://www.tinkoff.ru');
    I.goToPayments();
    I.goToCommunals();
    let regionName = await I.grabTextFrom({ xpath: "//span[@data-qa-file='PaymentsCatalogHeader']/span/span" });
    if (regionName != 'Москве') {
        I.goToChooseRegion();
        I.click('г. Москва');
    };
    I.see('Москве');
});

// Saving the name of the first service provider in the list of service providers and go to its page,
// than go to the payment tab

let serviceProviderName;

Scenario('Going to page of first service provider from list of providers', async (I) => {
    I.amOnPage('https://www.tinkoff.ru/payments/categories/kommunalnie-platezhi/');
    serviceProviderName = await I.grabTextFrom({ xpath: "//ul[@data-qa-file='UIScrollList']/li[1]" });
    I.click(serviceProviderName, { xpath: "//ul[@data-qa-file='UIScrollList']/li[1]" });
    I.see('Узнайте задолженность по ЖКУ в Москве', { xpath: "//div[@data-qa-file='PageTitleContainer']/div[@ data-qa-file='Text']" });
    I.click('Оплатить ЖКУ в Москве', { xpath: "//ul[@data-qa-file='Tabs']/li[2]//span" });
    I.see('Оплатите ЖКУ в Москве без комиссии', { xpath: "//div[@data-qa-file='PageTitleContainer']/div[@ data-qa-file='Text']" });
});

// Validations of error messages of mandatory fields on the payment page for the service provider 'ЖКУ-Москвa' 

let values = new DataTable(['value', 'errorText']);
    values.add(['', 'Поле обязательное']);
    values.add(['TestТест', 'Поле обязательное']);
    values.add(['±!@#$%^&*()_+=-№\:?', 'Поле обязательное']);
    values.add(['0', 'Поле неправильно заполнено']);
    values.add(['12345', 'Поле неправильно заполнено']);
    values.add(['123456789', 'Поле неправильно заполнено']);

Data(values).Scenario('Validation of payer code field', (I, current) => {
    I.validateErrorMessageOfPayerCode(current.value, current.errorText);
});

values = new DataTable(['value', 'errorText']);
    values.add(['', 'Поле обязательное']);
    values.add(['TestТест', 'Поле обязательное']);
    values.add(['±!@#$%^&*()_+=-№\:?', 'Поле обязательное']);
    values.add(['1', 'Поле заполнено некорректно']);
    values.add(['12.5', 'Поле заполнено некорректно']);
    values.add(['00.2019', 'Поле заполнено некорректно']);
    values.add(['13.2019', 'Поле заполнено некорректно']);

Data(values).Scenario('Validation of period field', (I, current) => {
    I.validateErrorMessageOfPeriod(current.value, current.errorText);
});

values = new DataTable(['value', 'errorText']);
    values.add(['', 'Поле обязательное']);
    values.add(['TestТест', 'Поле обязательное']);
    values.add(['±!@#$%^&*()_+=-№\:?', 'Поле заполнено неверно']);
    values.add(['0', 'Минимум — 10 ₽']);
    values.add(['1', 'Минимум — 10 ₽']);
    values.add(['9,994', 'Минимум — 10 ₽']);
    values.add(['15000,005', 'Максимум — 15' + '\u00A0' + '000 ₽']);
    values.add(['99999999999', 'Максимум — 15' + '\u00A0' + '000 ₽']);

Data(values).Scenario('Validation of amount of payment field', (I, current) => {
    I.validateErrorMessageOfAmountOfPayment(current.value, current.errorText);
});

// Checking that the appropriate service provider is the first in the results list of searching
// by its name using the string of fast search of service providers

Scenario('Service provider is first in search results list', (I) => {
    I.amOnPage('https://www.tinkoff.ru/zhku-moskva/oplata/?tab=pay');
    I.goToPayments();
    I.fillSearchOnPaymentsField(serviceProviderName);
    I.see(serviceProviderName, { xpath: "//div[@data-qa-file='Grid']/div[1]" });
});

// Searching the appropriate service provider using the string of fast search of service providers
// and going to its page from the search results. Checking that the page corresponds to the page
// which you transfer on from the list of service providers 

Scenario('Going to page of service provider from results of search', (I) => {
    I.amOnPage('https://www.tinkoff.ru/payments/');
    I.fillSearchOnPaymentsField(serviceProviderName);
    I.click(serviceProviderName, { xpath: "//div[@data-qa-file='Grid']/div[1]" });
    I.see('Узнайте задолженность по ЖКУ в Москве');
});

// Checking that the appropriate service provider is not visible for the St. Petersburg region

Scenario('Service provider is not listed in list of service providers for St. Petersburg', (I) => {
    I.amOnPage('https://www.tinkoff.ru/zhku-moskva/?tab=search');
    I.goToPayments();
    I.goToCommunals();
    I.goToChooseRegion();
    I.click('г. Санкт-Петербург');
    I.fillSearchOnPaymentsField(serviceProviderName);
    I.see('Ничего не найдено', { xpath: "//div[@data-qa-file='Grid']" });
});

//After(pause);