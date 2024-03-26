import Moralis from "moralis";
import { EvmChain } from "moralis/common-evm-utils";

export class MoralisRPC {
  initialize = async (address: string, chain: EvmChain) => {
    try {
      // Promise.all() for receiving data async from two endpoints
      const [nativeBalance, tokenBalances] = await Promise.all([
        Moralis.EvmApi.balance.getNativeBalance({
          chain,
          address,
        }),
        Moralis.EvmApi.token.getWalletTokenBalances({
          chain,
          address,
        }),
      ]);
      return {
        nativeBalance,
        tokenBalances,
      };
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
}
