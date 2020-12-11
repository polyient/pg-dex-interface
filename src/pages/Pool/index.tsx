import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Pair } from '@polyient-games/pg-uniswap-sdk-v1'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Question from '../../components/QuestionHelper'
import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { Text } from 'rebass'
import { LightCard } from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import AppBody from '../AppBody'
import { Dots } from '../../components/swap/styleds'
// import { PairLiquidity } from '../../components/PairLiquidity'
// import { PairLiquidity2 } from '../../components/PairLiquidity2'
import { PguAnnouncement } from '../../components/PguAnnouncement'

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  return (
    <>
      <AppBody>
        <PguAnnouncement />
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-5 mx-auto">
            <div className="dex-card p-4">
              <SwapPoolTabs active={'pool'} />
              

                <Link className="text-decoration-none" to={'/add/ETH'}>
                <button className="btn btn-pool btn-lg btn-block mb-3" style={{borderRadius: '8px'}}>Add Liquidity</button>
                </Link>

                <div className="swap_details mt-4" style={{borderRadius: '5px'}}>
                  <span className="swap_title" style={{left: '25%'}}>Your Liquidity <Question text="When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below." /></span>

                  <div className="p-4 ">
                    <b className="text-dex-dark pb-1 content-12 text-left">Your Pools:</b><br />
                    {!account ? (
                      <span className="text-center">Connect to a wallet to view your liquidity.</span>
                    ) : v2IsLoading ? (
                      <span className="text-center"><Dots>Loading</Dots></span>
                    ) : allV2PairsWithLiquidity?.length > 0 ? (
                      <>
                        {allV2PairsWithLiquidity.map(v2Pair => (
                          <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                        ))}
                      </>
                    ) : (
                      <span className="text-center">No liquidity found.</span>
                    )}
                    </div>
                  </div>
                <AutoColumn gap="12px" className="d-none" style={{ width: '100%' }}>
                  <RowBetween padding={'0 8px'}>
                    <Text color={theme.text1} fontWeight={500}>
                      Your Liquidity
                    </Text>
                    <Question text="When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below." />
                  </RowBetween>

                  {!account ? (
                    <div>
                    <div className="swap_details mt-4" style={{borderRadius: '5px'}}>
                      <span className="swap_title" style={{left: '25%'}}>Your Liquidity <Question text="When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below." /></span>
                      <div className="p-4 text-left">
                        <b className="text-dex-dark pb-1 content-12">Your Pools:</b><br />
                        <span className="text-dex-medium">Connect to a wallet to view your liquidity.</span>
                      </div>
                    </div>
                    <LightCard padding="40px">
                      <TYPE.body color={theme.text3} textAlign="center">
                        Connect to a wallet to view your liquidity.
                      </TYPE.body>
                    </LightCard>
                    </div>
                  ) : v2IsLoading ? (
                    <LightCard padding="40px">
                      <TYPE.body color={theme.text3} textAlign="center">
                        <Dots>Loading</Dots>
                      </TYPE.body>
                    </LightCard>
                  ) : allV2PairsWithLiquidity?.length > 0 ? (
                    <>
                      {allV2PairsWithLiquidity.map(v2Pair => (
                        <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                      ))}
                    </>
                  ) : (
                    <LightCard padding="40px">
                      <TYPE.body color={theme.text3} textAlign="center">
                        No liquidity found.
                      </TYPE.body>
                    </LightCard>
                  )}

                  <div>
                    <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                      {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : "Don't see a pool you joined?"}{' '}
                      <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                        {hasV1Liquidity ? 'Migrate now.' : 'Import it.'}
                      </StyledInternalLink>
                    </Text>
                  </div>
                </AutoColumn>
              
            </div>
          </div>
        </div>
      <br />
      </AppBody>

      <div className="d-none" style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
        <ButtonSecondary as={Link} style={{ width: 'initial' }} to="/migrate/v1">
          Migrate V1 Liquidity
        </ButtonSecondary>
      </div>
    </>
  )
}
