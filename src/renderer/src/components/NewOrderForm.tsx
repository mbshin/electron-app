import React, { useEffect, useMemo, useState } from 'react'
import { Row, Input, Select } from './fields'

export type NewOrderOut = {
  ACNT_NO: string
  ISIN: string
  SIDE: 'BUY' | 'SELL'
  ORD_TYPE: 'LIMIT' | 'MARKET'
  QTY: number
  PRICE?: number
  TIF: 'DAY' | 'IOC' | 'FOK'
  SHORT_CD: 'General' | 'Borrowed' | 'Other'
  CL_ORD_ID: string
}

export type ChildStateCb = (s: { valid: boolean; payload?: NewOrderOut; error?: string }) => void

export default function NewOrderForm({
  disabled,
  onState,
  initial
}: {
  disabled?: boolean
  onState: ChildStateCb
  initial?: Partial<NewOrderOut>
}) {
  const [f, setF] = useState({
    ACNT_NO: initial?.ACNT_NO ?? '',
    ISIN: initial?.ISIN ?? '',
    SIDE: initial?.SIDE ?? 'BUY',
    ORD_TYPE: initial?.ORD_TYPE ?? 'LIMIT',
    QTY: initial?.QTY?.toString?.() ?? '1',
    PRICE: (initial?.PRICE ?? 0).toString(),
    TIF: initial?.TIF ?? 'DAY',
    SHORT_CD: initial?.SHORT_CD ?? 'General',
    CL_ORD_ID: initial?.CL_ORD_ID ?? ''
  })

  const isMarket = f.ORD_TYPE === 'MARKET'

  const payload = useMemo<NewOrderOut | undefined>(() => {
    const qty = Number(f.QTY)
    const price = Number(f.PRICE)
    if (!f.ACNT_NO || !f.ISIN || !f.SIDE || !f.ORD_TYPE || !f.TIF || !f.CL_ORD_ID) return undefined
    if (!Number.isFinite(qty) || qty <= 0) return undefined
    if (f.ORD_TYPE === 'LIMIT' && (!Number.isFinite(price) || price <= 0)) return undefined
    return {
      ACNT_NO: f.ACNT_NO,
      ISIN: f.ISIN,
      SIDE: f.SIDE as 'BUY' | 'SELL',
      ORD_TYPE: f.ORD_TYPE as 'LIMIT' | 'MARKET',
      QTY: qty,
      ...(f.ORD_TYPE === 'LIMIT' ? { PRICE: price } : {}),
      TIF: f.TIF as 'DAY' | 'IOC' | 'FOK',
      SHORT_CD: f.SHORT_CD as 'General' | 'Borrowed' | 'Other',
      CL_ORD_ID: f.CL_ORD_ID
    }
  }, [f])

  useEffect(() => {
    if (!f.ACNT_NO) return onState({ valid: false, error: 'Account is required.' })
    if (!f.ISIN) return onState({ valid: false, error: 'ISIN is required.' })
    if (!f.CL_ORD_ID) return onState({ valid: false, error: 'Client Order ID is required.' })
    if (!/^\d+$/.test(f.QTY))
      return onState({ valid: false, error: 'Qty must be a positive integer.' })
    if (!isMarket && !/^\d+(\.\d+)?$/.test(f.PRICE)) {
      return onState({ valid: false, error: 'Price must be a positive number for LIMIT.' })
    }
    if (payload) return onState({ valid: true, payload })
    onState({ valid: false, error: 'Fill required fields.' })
  }, [f, isMarket, onState, payload])

  return (
    <div className="grid gap-4">
      <Row>
        <label>Account</label>
        <Input
          label="Account"
          value={f.ACNT_NO}
          onChange={(v) => setF({ ...f, ACNT_NO: v })}
          disabled={disabled}
          required
        />
      </Row>
      <Row>
        <label>ISIN</label>
        <Input
          label="ISIN"
          value={f.ISIN}
          onChange={(v) => setF({ ...f, ISIN: v })}
          disabled={disabled}
          required
        />
      </Row>
      <Row>
        <label>Side</label>
        <Select
          label="Side"
          value={f.SIDE}
          options={['BUY', 'SELL'] as const}
          onChange={(v) => setF({ ...f, SIDE: v })}
          disabled={disabled}
          required
        />
      </Row>
      <Row>
        <label>Order Type</label>
        <Select
          label="Order Type"
          value={f.ORD_TYPE}
          options={['LIMIT', 'MARKET'] as const}
          onChange={(v) => setF({ ...f, ORD_TYPE: v, ...(v === 'MARKET' ? { PRICE: '0' } : {}) })}
          disabled={disabled}
          required
        />
      </Row>
      <Row>
        <label>Qty</label>
        <Input
          label="Qty"
          value={f.QTY}
          onChange={(v) => setF({ ...f, QTY: v.replace(/[^\d]/g, '') })}
          disabled={disabled}
          required
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </Row>
      <Row>
        <label>Price</label>
        <Input
          label="Price"
          value={f.PRICE}
          onChange={(v) => setF({ ...f, PRICE: v.replace(/[^\d.]/g, '') })}
          disabled={disabled || isMarket}
          required={!isMarket}
          inputMode="decimal"
        />
      </Row>
      <Row>
        <label>TIF</label>
        <Select
          label="TIF"
          value={f.TIF}
          options={['DAY', 'IOC', 'FOK'] as const}
          onChange={(v) => setF({ ...f, TIF: v })}
          disabled={disabled}
          required
        />
      </Row>
      <Row>
        <label>Short Sell</label>
        <Select
          label="Short Sell"
          value={f.SHORT_CD}
          options={['General', 'Borrowed', 'Other'] as const}
          onChange={(v) => setF({ ...f, SHORT_CD: v })}
          disabled={disabled}
          required
        />
      </Row>
      <Row>
        <label>Client Ord ID</label>
        <Input
          label="Client Ord ID"
          value={f.CL_ORD_ID}
          onChange={(v) => setF({ ...f, CL_ORD_ID: v })}
          disabled={disabled}
          required
        />
      </Row>
    </div>
  )
}
