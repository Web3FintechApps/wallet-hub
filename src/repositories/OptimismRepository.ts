import { EvmChain } from "moralis/common-evm-utils";
import { MoralisSupportedChainRepo } from "./BaseRepository";

export class OptimismRepository extends MoralisSupportedChainRepo {
  constructor(_address: string) {
    super(_address, EvmChain.OPTIMISM);
  }
}
