import React, { } from 'react'

export function DexSunsetNotice() {

  return (
    <div>
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-5 mx-auto">
            <div className="dex-card p-4 mb-3">
                <h1 className="pt-1"><strong>Important User Notice</strong></h1>
                <p className="pt-1">On December 15th, 2022, the PolyientDEX user interface will no longer be available. After this date, LP withdrawals will only be possible through direct interaction with the smart contracts.</p>
                <p className="pt-1 text-danger">We strongly recommend removing liquidity tokens as soon as possible.</p>
            </div>
        </div>
      </div>
    </div>
  )
} 