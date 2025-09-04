import React, { useEffect, useMemo, useState } from 'react'
import { Row, Input, Select } from './fields'

export type CancelOut = {
  ACNT_NO: string
  ORIG_CL_ID: string
  REASON: 'UserReq' | 'Policy'
  CL_ORD_ID: string
}

export type CancelStateCb = (s: { valid: boolean; payload?: CancelOut; error?: string }) => void

export default function CancelOrderForm({
  disabled,
  onState,
  initial
}: {
  disabled?: boolean
  onState: CancelStateCb
  initial?: Partial<CancelOut>
}) {
  const [f, setF] = useState({
    ACNT_NO: initial?.ACNT_NO ?? '',
    ORIG_CL_ID: initial?.ORIG_CL_ID ?? '',
    REASON: initial?.REASON ?? 'UserReq',
    CL_ORD_ID: initial?.CL_ORD_ID ?? ''
  })

  const payload = useMemo<CancelOut | undefined>(() => {
    if (!f.ACNT_NO || !f.ORIG_CL_ID || !f.CL_ORD_ID) return undefined
    return { ...f } as CancelOut
  }, [f])

  useEffect(() => {
    if (!f.ACNT_NO) return onState({ valid: false, error: 'Account is required.' })
    if (!f.ORIG_CL_ID) return onState({ valid: false, error: 'Orig Client ID is required.' })
    if (!f.CL_ORD_ID) return onState({ valid: false, error: 'New Client ID is required.' })
    onState({ valid: !!payload, payload, error: payload ? undefined : 'Fill required fields.' })
  }, [f, onState, payload])

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
        <label>Orig Client ID</label>
        <Input
          label="Orig Client ID"
          value={f.ORIG_CL_ID}
          onChange={(v) => setF({ ...f, ORIG_CL_ID: v })}
          disabled={disabled}
          required
        />
      </Row>
      <Row>
        <label>Reason</label>
        <Select
          label="Reason"
          value={f.REASON}
          options={['UserReq', 'Policy'] as const}
          onChange={(v) => setF({ ...f, REASON: v })}
          disabled={disabled}
          required
        />
      </Row>
      <Row>
        <label>New Client ID</label>
        <Input
          label="New Client ID"
          value={f.CL_ORD_ID}
          onChange={(v) => setF({ ...f, CL_ORD_ID: v })}
          disabled={disabled}
          required
        />
      </Row>
    </div>
  )
}
