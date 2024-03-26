export const generateHumanReadableCryptoBalance = (
  _balance: number | string,
  decimals?: number,
  symbol?: string
): string => {
  let balance = 0;
  if (typeof _balance === "string" && decimals !== undefined) {
    const decimalNumber = BigInt(_balance).toString();
    balance = +decimalNumber / Math.pow(10, decimals);
    return `${symbol ?? ""} ${balance.toFixed(5)}`;
  }
  if (typeof balance === "number" && decimals !== undefined) {
    balance = balance / Math.pow(10, decimals);
    return `${symbol ?? ""} ${balance.toFixed(5)}`;
  }
  balance = +_balance;
  return `${symbol ?? ""} ${balance.toFixed(5)}`;
};
