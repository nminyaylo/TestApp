
module.exports = function () {
  return actor({
    // Helper for clicking on 'Платежи' link
    goToPayments: function () {
      this.click('Платежи', { xpath: "//a[@aria-label='Платежи']" });
    },

    // Helper for clicking on 'ЖКХ' link
    goToCommunals: function () {
      this.click('ЖКХ', { xpath: "//div[@aria-label='ЖКХ']//div" });
    },

    // Helper for navigating to the region selector
    goToChooseRegion: function () {
      this.click({ xpath: "//span[@data-qa-file='PaymentsCatalogHeader']/span/span"});
    },

    // Helper for filling of input 'Поиск по платежам'
    // NOTE: At the moment the real browsers have the different placeholder compared
    //       default puppeter browser!
    fillSearchOnPaymentsField: function (serviceProviderName) {
      this.fillField({ xpath: "//input[@placeholder='Поиск по платежам']" }, serviceProviderName);
    },

    // Helper for validation of the payer's code field
    validateErrorMessageOfPayerCode: function (testFieldValue, errorMessageExpected) {
      this.amOnPage('https://www.tinkoff.ru/zhku-moskva/oplata/?tab=pay');
      this.fillField('provider-payerCode', testFieldValue);
      this.click('Оплатить ЖКУ в Москве', { xpath: "//div[@data-qa-file='FormFieldSet']//button" });
      this.see(errorMessageExpected, { xpath: "//label[@for='payerCode']/parent::*/following-sibling::div" });
    },

    // Helper for validation of the period of payments field 
    validateErrorMessageOfPeriod: function (testFieldValue, errorMessageExpected) {
      this.amOnPage('https://www.tinkoff.ru/zhku-moskva/oplata/?tab=pay');
      this.fillField('provider-period', testFieldValue);
      this.click('Оплатить ЖКУ в Москве', { xpath: "//div[@data-qa-file='FormFieldSet']//button" });
      this.see(errorMessageExpected, { xpath: "//label[@for='period']/parent::*/parent::*/following-sibling::div" });
    },

    // Helper for validation of the amount of payment field
    validateErrorMessageOfAmountOfPayment: function (testFieldValue, errorMessageExpected) {
      this.amOnPage('https://www.tinkoff.ru/zhku-moskva/oplata/?tab=pay');
      this.fillField({ xpath: "//div[@data-qa-file='GridColumn']/form/div[4]//input" }, testFieldValue);
      this.click('Оплатить ЖКУ в Москве', { xpath: "//div[@data-qa-file='FormFieldSet']//button" });
      this.see(errorMessageExpected, { xpath: "//div[@data-qa-file='GridColumn']/form/div[4]//div[@data-qa-file='UIFormRowError']" });
    }
  });
}
