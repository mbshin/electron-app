import React, { useEffect, useMemo, useState } from 'react'
import { Row, Input } from './fields'

export type AmendOut = {
  ACNT_NO: string
  ORIG_CL_ID: string
  NEW_QTY?: number
  NEW_PRICE?: number
  CL_ORD_ID: string
}

export type AmendStateCb = (s: { valid: boolean; payload?: AmendOut; error?: string }) => void

export default function AmendOrderForm({
                                    disabled,
                                    onState,
                                    initial,
                                  }: {
  disabled?: boolean
  onState: AmendStateCb
  initial?: Partial<AmendOut>
}) {
  const [f, setF] = useState({
    ACNT_NO: initial?.ACNT_NO ?? '',
    ORIG_CL_ID: initial?.ORIG_CL_ID ?? '',
    NEW_QTY: initial?.NEW_QTY?.toString?.() ?? '',
    NEW_PRICE: initial?.NEW_PRICE?.toString?.() ?? '',
    CL_ORD_ID: initial?.CL_ORD_ID ?? '',
  })

  const payload = useMemo<AmendOut | undefined>(() => {
    if (!f.ACNT_NO || !f.ORIG_CL_ID || !f.CL_ORD_ID) return undefined
    const out: AmendOut = {
      ACNT_NO: f.ACNT_NO,
      ORIG_CL_ID: f.ORIG_CL_ID,
      CL_ORD_ID: f.CL_ORD_ID,
    }
    if (f.NEW_QTY) {
      const q = Number(f.NEW_QTY)
      if (!Number.isFinite(q) || q <= 0) return undefined
      out.NEW_QTY = q
    }
    if (f.NEW_PRICE) {
      const p = Number(f.NEW_PRICE)
      if (!Number.isFinite(p) || p <= 0) return undefined
      out.NEW_PRICE = p
    }
    if (!out.NEW_QTY && !out.NEW_PRICE) return undefined
    return out
  }, [f])

  useEffect(() => {
    if (!f.ACNT_NO) return onState({ valid: false, error: 'Account is required.' })
    if (!f.ORIG_CL_ID) return onState({ valid: false, error: 'Orig Client ID is required.' })
    if (!f.CL_ORD_ID) return onState({ valid: false, error: 'New Client ID is required.' })
    if (!f.NEW_QTY && !f.NEW_PRICE) return onState({ valid: false, error: 'Provide NEW_QTY and/or NEW_PRICE.' })
    if (payload) return onState({ valid: true, payload })
    onState({ valid: false, error: 'Check NEW_QTY/NEW_PRICE.' })
  }, [f, onState, payload])

  return (
    <div className="grid gap-4">
      <Row>
        <label>Account</label>
        <Input label="Account" value={f.ACNT_NO} onChange={(v) => setF({ ...f, ACNT_NO: v })} disabled={disabled} required />
      </Row>
      <Row>
        <label>Orig Client ID</label>
        <Input label="Orig Client ID" value={f.ORIG_CL_ID} onChange={(v) => setF({ ...f, ORIG_CL_ID: v })} disabled={disabled} required />
      </Row>
      <Row>
        <label>New Qty</label>
        <Input
          label="New Qty"
          value={f.NEW_QTY}
          onChange={(v) => setF({ ...f, NEW_QTY: v.replace(/[^\d]/g, '') })}
          disabled={disabled}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </Row>
      <Row>
        <label>New Price</label>
        <Input
          label="New Price"
          value={f.NEW_PRICE}
          onChange={(v) => setF({ ...f, NEW_PRICE: v.replace(/[^\d.]/g, '') })}
          disabled={disabled}
          inputMode="decimal"
        />
      </Row>
      <Row>
        <label>New Client ID</label>
        <Input label="New Client ID" value={f.CL_ORD_ID} onChange={(v) => setF({ ...f, CL_ORD_ID: v })} disabled={disabled} required />
      </Row>
    </div>
  )
}
