const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  
  export const formatCurrency = (cents: number) => currency.format(cents / 100);