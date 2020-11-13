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
  const reserve0Units = getReserves.reserve0.toString()/(10**6); // double check
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

const getCurrentPrice = async function(eth_unit:any,usdc_unit:any){
   const response_usdc = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/contract/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
   const data_usdc =  await response_usdc.json();

   let usdc = {eth:data_usdc.market_data.current_price.eth,usd: data_usdc.market_data.current_price.usd}
   let eth = {usdc:(1.0/data_usdc.market_data.current_price.eth),usd: ((1.0/data_usdc.market_data.current_price.eth)*data_usdc.market_data.current_price.usd)}

   let total = eth_unit*eth.usd + usdc_unit*usdc.usd;
   return {usdc,eth,total}
}

export function PairLiquidity2() {
  const { account, chainId, library} = useWeb3React()
  const [totalPrice, setTotalPrice] = useState<string>('')
  const [usdcEth, setUsdcEth] = useState<string>('')
  const [usdcUsd, setUsdcUsd] = useState<string>('')
  const [ethUsdc, setEthUsdc] = useState<string>('')
  const [ethUsd, setEthUsd] = useState<string>('')

  let view_data:any = {}; 
  if (!chainId || !library || !account) return null

  if(interval!=null){
    clearInterval(interval);
  }
  let fn = async()=>{
    const pairAddress = '0xdf97d3838b679897bd5be0fd090c3ee381c20479'; // usdc - eth
    const {
        reserve0Units,
        reserve1Units,
    }:any = await getPairInfo(library, getContract(pairAddress, IUniswapV2PairABI, library, account));
  view_data = await getCurrentPrice(reserve1Units,reserve0Units);
  setTotalPrice(`${new Intl.NumberFormat().format(view_data.total.toFixed(2))}`);
  setUsdcEth(view_data.usdc.eth.toFixed(4));
  setUsdcUsd(`$${view_data.usdc.usd.toFixed(2)}`);
  setEthUsdc(view_data.eth.usdc.toFixed(4));
  setEthUsd(`$${view_data.eth.usd.toFixed(2)}`);
  }
  interval = setInterval(fn,40000);
  fn();
  return (
    <div> 
      {parseFloat(totalPrice) > 0 ?
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-5 mx-auto">
       <div className="dex-card p-4 mb-3">
        <h1 className="text-left pt-1">USDC - ETH</h1>
        <div className="row">
          <div className="col-lg-6">
            <label className="text-dex-dark">Total Liquidity</label>
            <h1>${totalPrice} </h1>
          </div>
          <div className="col-lg-6">
            <label className="text-dex-dark">Last Price</label>
            <p className="text-white">
              1 USDC = {usdcEth} ETH ({usdcUsd})<br/>
              1 ETH = {ethUsdc} USDC ({ethUsd})
            </p>
          </div>
          <div className="col-lg-12 text-center">
            <small className="text-white">Note: We are working on a more robust analytics view and will post on our social outlets once this is live!</small>
          </div>
          <hr></hr>
          <div className="col-lg-12 text-center">
            <a className="text-decoration-none" href="https://etherscan.io/address/0xdf97d3838b679897bd5be0fd090c3ee381c20479" target="_blank"><small className="text-white">View Details on Etherscan.io</small></a>
          </div>
        </div>
        </div>
        </div>
        </div>
        : null}
    </div>
  )
} 