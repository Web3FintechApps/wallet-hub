import { Network } from "alchemy-sdk";
import { AlchemyRPC } from "lib/rpc-endpoints/alchemy";
import { MoralisRPC } from "lib/rpc-endpoints/moralis";
import { generateHumanReadableCryptoBalance } from "lib/utils";
import { EvmChain } from "moralis/common-evm-utils";

export type TTokenBalance = {
  tokenName: string;
  tokenBalance: string;
  tokenAddress: string;
};

export interface UserChainInterface {
  address: string;
  getTransactionHistory: () => { date: string; details: string }[];
  getTokenBalances: () => Promise<{ data: TTokenBalance[]; total: number }>;
  getNativeTokenBalance: () => string;
}

export abstract class MoralisSupportedChainRepo implements UserChainInterface {
  address;
  network;
  constructor(_address: string, _network: EvmChain) {
    this.address = _address;
    this.network = _network;
  }
  getNativeTokenBalance = () => "";
  getTokenBalances = async () => {
    const rpc = new MoralisRPC();
    const data = await rpc.initialize(this.address, this.network);
    const balances = data?.tokenBalances;
    const nativeBalance = data?.nativeBalance;

    let balancesFormatted =
      balances?.result
        ?.filter((balance) => balance.token?.possibleSpam === false)
        .map((balance): TTokenBalance => {
          return {
            tokenName: balance.token?.name ?? "",
            tokenBalance: generateHumanReadableCryptoBalance(
              balance.amount.toHex().toString(),
              balance?.decimals ?? undefined
            ),
            tokenAddress: balance.token?.contractAddress.lowercase ?? "",
          };
        }) ?? [];
    balancesFormatted = [
      {
        tokenAddress: this.network.apiHex.toString() ?? "",
        tokenBalance: generateHumanReadableCryptoBalance(
          +(nativeBalance?.result.balance.ether ?? 0),
          undefined
        ),
        tokenName: this.network.name ?? "",
      },
      ...balancesFormatted,
    ];
    return { data: balancesFormatted, total: balancesFormatted?.length };
  };
  getTransactionHistory = () => [];
}
export abstract class AlchemySupportedChainRepo implements UserChainInterface {
  address;
  network;
  constructor(_address: string, _network: Network) {
    this.address = _address;
    this.network = _network;
  }
  getNativeTokenBalance = () => "";
  getTokenBalances = async () => {
    const alchemy = new AlchemyRPC(this.network);
    const balances = await alchemy.rpc?.core.getTokenBalances(this.address);

    let balancesFormatted = balances.tokenBalances
      .filter((token) => {
        return token.tokenBalance !== "0";
      })
      .map((balance): TTokenBalance => {
        return {
          tokenName: balance.contractAddress,
          tokenBalance: balance.tokenBalance ?? "",
          tokenAddress: balance.contractAddress,
        };
      });
    // TODO: Implement pagination for all requests, as the max amount of requests for now permitted by alchemy is 5
    balancesFormatted = await Promise.all(
      balancesFormatted
        .slice(0, 5)
        .map(async (_balance): Promise<TTokenBalance> => {
          const metaData = await alchemy.rpc?.core.getTokenMetadata(
            _balance.tokenAddress
          );
          const formattedBalance = generateHumanReadableCryptoBalance(
            _balance.tokenBalance,
            metaData?.decimals ?? undefined
          );
          return {
            tokenAddress: _balance.tokenAddress,
            tokenBalance: formattedBalance,
            tokenName: metaData.name ?? "",
          };
        })
    );
    return { data: balancesFormatted, total: balancesFormatted.length };
  };
  getTransactionHistory = () => [];
}
