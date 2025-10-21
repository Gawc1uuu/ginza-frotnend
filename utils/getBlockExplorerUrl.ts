import { CHAIN_INFO, SOLANA_DEVNET } from "../../../packages/shared/onchain.constants";

export const getBlockExplorerUrl = (chainId:string, txHash:string) => {
    const explorerInfo = CHAIN_INFO[chainId];
    if(!explorerInfo){
        return null;
    }
    if(chainId === SOLANA_DEVNET.id){
        return `${explorerInfo.explorer}/tx/${txHash}?cluster=devnet`;
    }

    return `${explorerInfo.explorer}/tx/${txHash}`;
}