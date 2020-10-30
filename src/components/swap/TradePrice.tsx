import React from 'react'
import { Price } from '@polyient-games/pg-uniswap-sdk-v1'
import { useContext } from 'react'
// import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
// import { StyledBalanceMaxMini } from './styleds'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const theme = useContext(ThemeContext)

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

  return (
    <span className="text-dex-medium">
      
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <span className="ml-2 text-dex-medium cursor-pointer" onClick={() => setShowInverted(!showInverted)}><i className="fa fa-sync" /></span>
        </>
      ) : (
        '-'
      )}
      <Text
      className="d-none"
      fontWeight={500}
      fontSize={14}
      color={theme.text2}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >

    </Text>
      </span>

    
  )
}
