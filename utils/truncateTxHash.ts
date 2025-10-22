export function truncateTxHash(txHash:string){
    if(!txHash || txHash.length === 0){
        return "NOT_FOUND"
    }
    return txHash.slice(0,4) + "..." + txHash.slice(-4);
}