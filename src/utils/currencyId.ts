import { Currency, ETHER, Token } from '@polyient-games/pg-uniswap-sdk-v1'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
