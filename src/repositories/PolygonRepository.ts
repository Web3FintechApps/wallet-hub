import { EvmChain } from "moralis/common-evm-utils";
import { MoralisSupportedChainRepo } from "./BaseRepository";

export class PolygonRepository extends MoralisSupportedChainRepo {
  constructor(_address: string) {
    super(_address, EvmChain.POLYGON);
  }
}
