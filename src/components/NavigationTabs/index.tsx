import React from 'react'
import styled from 'styled-components'
// import { darken } from 'polished'
// import { useTranslation } from 'react-i18next'
import { Link as HistoryLink, Link as Tablink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

// const activeClassName = 'ACTIVE'

/*const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`*/

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`



export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  // const { t } = useTranslation()
  return (
    <div>
        <div>
          <div className="d-flex justify-content-between">
            <h1 className="text-center pt-1">Choose Your Path:</h1>
            <div>
              <Tablink to={'/swap'}>
              <button className={(active === 'swap' ? 'btn btn-theme-rounded' : 'btn btn-pool-outline-rounded')}>SWAP</button>
              </Tablink>
              <Tablink to={'/pool'}>
              <button className={(active === 'pool' ? 'btn btn-pool-rounded' : 'btn btn-theme-outline-rounded')}>POOL</button>
              </Tablink>
            </div>
          </div>
        </div>
        <hr style={{borderTop: '1px solid #1F262D'}} />
      
    </div>
  )
}

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <ArrowLeft className="text-dex-light" />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  return (
    <Tabs>
      <RowBetween className="my-3">
        <HistoryLink to="/pool">
          <ArrowLeft className="text-dex-light" />
        </HistoryLink>
        <ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
        <QuestionHelper
          text={
            adding
              ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
              : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}
