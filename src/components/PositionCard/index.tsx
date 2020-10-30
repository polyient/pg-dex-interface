import { JSBI, Pair, Percent } from '@polyient-games/pg-uniswap-sdk-v1'
import { darken } from 'polished'
import React, { useState } from 'react'
import { ChevronDown } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'

import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'


import Card, { GreyCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg2};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && (
        <div>
          <div className="dex-position-card text-center mt-4 p-4">
            <h4>
              <span className="mr-2">Your Position:</span>
              <div className="dropdown dex-dropdown" style={{display: 'inline-block'}}>
                <button className="btn btn-secondary " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                  {currency0.symbol} / {currency1.symbol}
                  {
                    userPoolBalance ? 
                    <span className="sm-circle-primary ml-1">
                      {userPoolBalance.toSignificant(4)}
                    </span>
                    :
                    ''
                  }
                  
                </button>
              </div>
            </h4>
            <div className="text-dex-medium mt-3">
              <span className="pr-2">
                {currency0.symbol}:
                {token0Deposited ? (
                <span className="sm-circle-secondary ml-1">{token0Deposited?.toSignificant(6)}</span>
                ) : (
                  ''
                )}
              </span>
              <span className="border-left pl-3">
                {currency1.symbol}:
                {token1Deposited ? (
                <span className="sm-circle-secondary ml-1">{token1Deposited?.toSignificant(6)}</span>
                ) : (
                  '-'
                )}
              </span>
            </div>
          </div>
        <GreyCard border={border} className="d-none">
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text color="#888D9B" fontSize={16} fontWeight={500}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text color="#888D9B" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color="#888D9B" fontSize={16} fontWeight={500}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text color="#888D9B" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
        </div>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <div>

      {showMore ? (
        <div className="token_details border py-4 mt-2">
          <h4 className="text-center cursor-pointer" onClick={() => setShowMore(!showMore)}>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
            {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol} / ${currency1.symbol}`}
            <i className="fa fa-chevron-up ml-1 text-dex-medium" />
          </h4>
          <ul className="px-5 detailed_list">
            <li className="d-flex justify-content-between">
              <span>Pooled {currency0.symbol}:</span>
              <span>
                {token0Deposited ? (
                  <span>
                    {token0Deposited?.toSignificant(6)}
                    <CurrencyLogo  style={{ marginLeft: '8px' }} currency={currency0} />
                  </span>
                ) : (
                  '-'
                )}
              </span>
            </li>
            <li className="d-flex justify-content-between">
              <span>Pooled {currency1.symbol}:</span>
              <span>
                {token1Deposited ? (
                  <span>
                    {token1Deposited?.toSignificant(6)}
                    <CurrencyLogo  style={{ marginLeft: '8px' }} currency={currency1} />
                  </span>
                ) : (
                  '-'
                )}
              </span>
            </li>
            <li className="d-flex justify-content-between">
              <span>Your Pool Tokens:</span>
              <span>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</span>
            </li>
            <li className="d-flex justify-content-between">
              <span>Your Pool Share:</span>
              <span>{poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}</span>
            </li>
          </ul>
          <div className="text-center">
            <Link to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}><button className="btn btn-pool">Add</button></Link>
            <Link to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}><button className="btn btn-outline-pool ml-2">Remove</button></Link>
          </div>
          <div className="d-flexs justify-content-center d-none">
            <div className="my-4 w-75">
              <a className="hr-sect content-12 text-dex-success" target="_blank" href={`https://uniswap.info/pair/${pair.liquidityToken.address}`}>View Pool Info ↗</a>
            </div>
          </div>
        </div>
      ) : (
        
        <div className="dropdown dex-dropdown mt-2">
          <button className="btn btn-secondary" type="button" onClick={() => setShowMore(!showMore)}>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
            {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol} / ${currency1.symbol}`}
            <ChevronDown size="20" style={{ marginLeft: '10px' }} />
          </button>
        </div>
        
      )}

    </div>
  )
}
