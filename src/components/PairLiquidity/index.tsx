import React, { useState } from 'react'

import {  useWeb3React } from '@web3-react/core'
import { getContract } from '../../utils'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
let interval:any = null;
 
const getPairInfo = async function(web3:any, pair:any){
  if (!pair) return
  const token0Promise = await pair.token0();
  const token1Promise = await pair.token1();
  const getReservesPromise = await pair.getReserves();
  const price0CumulativeLastPromise = await pair.price0CumulativeLast();
  const price1CumulativeLastPromise = await pair.price1CumulativeLast();
  const kLastPromise = await pair.kLast();

  const [
      token0,
      token1,
      getReserves,
      price0CumulativeLast,
      price1CumulativeLast,
      kLast,
  ] = await Promise.all([
      token0Promise,
      token1Promise,
      getReservesPromise,
      price0CumulativeLastPromise,
      price1CumulativeLastPromise,
      kLastPromise,
  ]);
  const reserve0Units = getReserves.reserve0.toString()/(10**18);
  const reserve1Units = getReserves.reserve1.toString()/(10**18);
  return {
      token0Address: token0,
      token1Address: token1,
      reserve0: getReserves.reserve0.toString(),
      reserve1: getReserves.reserve1.toString(),
      reserve0Units,
      reserve1Units,
      blockTimestampLast: getReserves.blockTimestampLast.toString(),
      price0CumulativeLast,
      price1CumulativeLast,
      kLast,
  };
}  


const getCurrentPrice = async function(eth_unit:any,pgt_unit:any){
   const response_pgt = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/contract/0xeaccb6E0f24d66cF4Aa6cBDa33971b9231d332a1');
   const data_pgt =  await response_pgt.json();

  //  const response_eth = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/contract/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
  //  const data_eth =  await response_eth.json();

   let pgt = {eth:data_pgt.market_data.current_price.eth,usd: data_pgt.market_data.current_price.usd}
   let eth = {pgt:(1.0/data_pgt.market_data.current_price.eth),usd: ((1.0/data_pgt.market_data.current_price.eth)*data_pgt.market_data.current_price.usd)}

   let total = eth_unit*eth.usd + pgt_unit*pgt.usd;
   return {pgt,eth,total}
   
}


export function PairLiquidity() {
  const { account, chainId, library} = useWeb3React()
  const [totalPrice, setTotalPrice] = useState<string>('')
  const [pgtEth, setPgtEth] = useState<string>('')
  const [pgtUsd, setPgtUsd] = useState<string>('')
  const [ethPgt, setEthPgt] = useState<string>('')
  const [ethUsd, setEthUsd] = useState<string>('')


  let view_data:any = {}; 
  if (!chainId || !library || !account) return null

  if(interval!=null){
    clearInterval(interval);
    // console.log("clearIntervalclearIntervalclearInterval");
  }
  let fn = async()=>{
    const pairAddress = '0xcebEcA2F22080a7Eb1C810e8a3Ed42bbCfF233c6'; //PGT - ETH
    const {
        reserve0Units,
        reserve1Units,
    }:any = await getPairInfo(library, getContract(pairAddress, IUniswapV2PairABI, library, account));
  view_data = await getCurrentPrice(reserve0Units,reserve1Units);
  setTotalPrice(`${view_data.total.toFixed(2)}`);
  setPgtEth(view_data.pgt.eth.toFixed(4));
  setPgtUsd(`$${view_data.pgt.usd.toFixed(4)}`);
  setEthPgt(view_data.eth.pgt.toFixed(4));
  setEthUsd(`$${view_data.eth.usd.toFixed(4)}`);
  }
  interval = setInterval(fn,20000);
  fn();
  return (
    <div> 
      {parseFloat(totalPrice) > 0 ?
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-5 mx-auto">
       <div className="dex-card p-4 mb-3">
        <h1 className="text-left pt-1">PGT - ETH</h1>
        <div className="row">
          <div className="col-lg-6">
            <label className="text-dex-dark">Total Liquidity</label>
            <h1>${totalPrice} </h1>
          </div>
          <div className="col-lg-6">
            <label className="text-dex-dark">Current Price</label>
            <p className="text-white">
              1 PGT ={pgtEth} ETH ({pgtUsd})<br/>
              1 ETH = {ethPgt} PGT ({ethUsd})
            </p>
          </div>
          <div className="col-lg-12 text-center">
            <small className="text-white">Note: Numbers might be delayed. We are working on a more robust analytics view and will post on our social outlets once this is live!</small>
          </div>
        </div>
        </div>
        </div>
        </div>
        : null}
    </div>
  )
} 