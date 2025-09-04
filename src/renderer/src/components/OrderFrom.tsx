import React, { useState } from "react"

type MsgType = "NEW_ORDER" | "CANCEL" | "AMEND"

type Props = { onSent: (hex: string) => void; disabled?: boolean }

declare global {
  interface Window {
    koscom: {
      send: (type: MsgType, payload: any) => Promise<string>
    }
  }
}

// ---- Reusable UI ----
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-3 items-center gap-3">{children}</div>
)

const Input = ({
                 label,
                 value,
                 onChange,
                 type = "text",
                 disabled,
               }: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  disabled?: boolean
}) => (
  <div className="relative col-span-2">
    <input
      type={type}
      className="peer w-full rounded-xl border border-gray-300 bg-white px-3 pt-5 pb-2 text-sm
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition disabled:opacity-50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      disabled={disabled}
    />
    <label
      className="absolute left-3 top-2 text-xs text-gray-500 transition-all
                 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm
                 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
    >
      {label}
    </label>
  </div>
)

const Select = ({
                  label,
                  value,
                  options,
                  onChange,
                  disabled,
                }: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  disabled?: boolean
}) => (
  <div className="relative col-span-2">
    <select
      className="peer w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 pt-5 pb-2 text-sm
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition disabled:opacity-50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
    <label
      className="absolute left-3 top-2 text-xs text-gray-500 transition-all
                 peer-focus:text-blue-600"
    >
      {label}
    </label>
  </div>
)

// ---- Component ----
export default function OrderForm({ onSent, disabled }: Props) {
  const [type, setType] = useState<MsgType>("NEW_ORDER")
  const [f, setF] = useState<any>({
    ACNT_NO: "",
    ISIN: "",
    SIDE: "BUY",
    ORD_TYPE: "LIMIT",
    QTY: "1",
    PRICE: "0",
    TIF: "DAY",
    SHORT_CD: "General",
    CL_ORD_ID: "",
    ORIG_CL_ID: "",
    REASON: "UserReq",
    NEW_QTY: "",
    NEW_PRICE: "",
  })
  const [err, setErr] = useState<string>()
  const [isSending, setIsSending] = useState(false)

  const send = async () => {
    try {
      setErr(undefined)
      setIsSending(true)
      const hex = await window.koscom.send(type, f)
      onSent(hex)
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setIsSending(false)
    }
  }

  const disabledAll = disabled || isSending

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm font-semibold text-gray-700">Message</div>
        <select
          className="rounded-xl border px-3 py-2"
          value={type}
          onChange={(e) => setType(e.target.value as MsgType)}
          disabled={disabledAll}
        >
          <option value="NEW_ORDER">NEW_ORDER</option>
          <option value="CANCEL">CANCEL</option>
          <option value="AMEND">AMEND</option>
        </select>
      </div>

      {/* ---------- NEW ORDER ---------- */}
      {type === "NEW_ORDER" && (
        <div className="grid gap-4">
          <Row>
            <label>Account</label>
            <Input label="Account" value={f.ACNT_NO} onChange={(v) => setF({ ...f, ACNT_NO: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>ISIN</label>
            <Input label="ISIN" value={f.ISIN} onChange={(v) => setF({ ...f, ISIN: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>Side</label>
            <Select label="Side" value={f.SIDE} options={["BUY", "SELL"]} onChange={(v) => setF({ ...f, SIDE: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>Order Type</label>
            <Select label="Order Type" value={f.ORD_TYPE} options={["LIMIT", "MARKET"]} onChange={(v) => setF({ ...f, ORD_TYPE: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>Qty</label>
            <Input label="Qty" value={f.QTY} onChange={(v) => setF({ ...f, QTY: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>Price</label>
            <Input label="Price" value={f.PRICE} onChange={(v) => setF({ ...f, PRICE: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>TIF</label>
            <Select label="TIF" value={f.TIF} options={["DAY", "IOC", "FOK"]} onChange={(v) => setF({ ...f, TIF: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>Short Sell</label>
            <Select label="Short Sell" value={f.SHORT_CD} options={["General", "Borrowed", "Other"]} onChange={(v) => setF({ ...f, SHORT_CD: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>Client Ord ID</label>
            <Input label="Client Ord ID" value={f.CL_ORD_ID} onChange={(v) => setF({ ...f, CL_ORD_ID: v })} disabled={disabledAll} />
          </Row>
        </div>
      )}

      {/* ---------- CANCEL ---------- */}
      {type === "CANCEL" && (
        <div className="grid gap-4">
          <Row>
            <label>Account</label>
            <Input label="Account" value={f.ACNT_NO} onChange={(v) => setF({ ...f, ACNT_NO: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>Orig Client ID</label>
            <Input label="Orig Client ID" value={f.ORIG_CL_ID} onChange={(v) => setF({ ...f, ORIG_CL_ID: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>Reason</label>
            <Select label="Reason" value={f.REASON} options={["UserReq", "Policy"]} onChange={(v) => setF({ ...f, REASON: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>New Client ID</label>
            <Input label="New Client ID" value={f.CL_ORD_ID} onChange={(v) => setF({ ...f, CL_ORD_ID: v })} disabled={disabledAll} />
          </Row>
        </div>
      )}

      {/* ---------- AMEND ---------- */}
      {type === "AMEND" && (
        <div className="grid gap-4">
          <Row>
            <label>Account</label>
            <Input label="Account" value={f.ACNT_NO} onChange={(v) => setF({ ...f, ACNT_NO: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>Orig Client ID</label>
            <Input label="Orig Client ID" value={f.ORIG_CL_ID} onChange={(v) => setF({ ...f, ORIG_CL_ID: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>New Qty</label>
            <Input label="New Qty" value={f.NEW_QTY} onChange={(v) => setF({ ...f, NEW_QTY: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>New Price</label>
            <Input label="New Price" value={f.NEW_PRICE} onChange={(v) => setF({ ...f, NEW_PRICE: v })} disabled={disabledAll} />
          </Row>
          <Row>
            <label>New Client ID</label>
            <Input label="New Client ID" value={f.CL_ORD_ID} onChange={(v) => setF({ ...f, CL_ORD_ID: v })} disabled={disabledAll} />
          </Row>
        </div>
      )}

      {/* ---------- STATUS ---------- */}
      {err && <div className="text-red-600 text-sm mt-4">{err}</div>}

      <div className="flex justify-end mt-6">
        <button
          disabled={disabledAll}
          onClick={send}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  )
}
