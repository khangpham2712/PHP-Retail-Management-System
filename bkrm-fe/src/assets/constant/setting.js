const setting = {
    //
    averageCost:{status:true},
    inventory: { status: true },
    recommendedProduct: { status: true },
    variation: { status: true },
    expiryDate: { status: true },

    //
    customerScore: {
      status: false,
      value: 10000,
      exceptDiscountProduct: false,
      exceptDiscountInvoice: false,
      exceptVoucher: false,
    },
    email: {
      status: false,
      emailAddress: "",
      password: "",
    },
    notifyDebt: {
      status: true,
      checkDebtAmount: true,
      debtAmount: "500000",
      checkNumberOfDay: false,
      numberOfDay: "15",
      typeDebtDay: "firstDebt",
      canNotContinueBuy: false,
      canNotContinueDebt: false,
    },

    //
    returnLimit: {
      status: false,
      day: 7,
    },
    canFixPriceSell: {
      status: false,
      cart: false,
      import: true,
      returnCart: true,
      returnImport: true,
    },
    printReceiptWhenSell: {
      status: true,
      cart: true,
      import: false,
      returnCart: false,
      returnImport: false,
      order: false,
      checkInventroy: false,
      cartModal:"large",
      titleNote:"",
      contentNote:""
    },
    alowDebt: {
      status: true,
    },
    canSellWhenNegativeQuantity: {
      status: true,
    },
    canEnterDiscountWhenSell:{
      status: true,
    },
    defaultPaymentAmount:{
      status:true,
      cart:true,
      import:true
    },
    discount: {
      status: true,
      applyMultiple: false,
      applyOnline: true,
    },
    voucher: { status: true },
    delivery: { status: true },

    vat: {
      status: false,
      listCost: [],
      // { key: "1", costName: "", value: 0, type: "%" }
    },

    //
    orderLowStock: {
      status: true,
      choiceRec: "Auto", //"Setting"
      dayAuto: 7, //"Setting"
      choiceQuantity: "select", //number
      selectQuantity: "latest", //avg
      inputQuantity: 10,
      noHistoryQuantity:10,
      selectSuplier: "latest", //manytime
    },
    autoApplyDiscount: { status: true },
  }
  export default setting