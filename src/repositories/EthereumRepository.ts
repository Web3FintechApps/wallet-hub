// Setup: npm install alchemy-sdk
import { MoralisSupportedChainRepo } from "./BaseRepository";
import { EvmChain } from "moralis/common-evm-utils";

export class EthereumRepository extends MoralisSupportedChainRepo {
  constructor(_address: string) {
    super(_address, EvmChain.ETHEREUM);
  }
}
// export class EthereumRepository extends AlchemySupportedChainRepo {
//   constructor(_address: string) {
//     super(_address, Network.ETH_MAINNET);
//   }
// }
