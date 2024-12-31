// components/ui-custom/otp-input.tsx
"use client"

import * as React from "react"
import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// @ts-expect-error ignored
interface OTPInputProps extends React.HTMLAttributes<HTMLDivElement> {
  length: number
  value: string[]
  disabled?: boolean
  onChange: (value: string[]) => void
}

export function OTPInput({
  length,
  value,
  disabled = false,
  onChange,
  className,
  ...props
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (text: string, index: number) => {
    const newValue = value.map((item, valueIndex) => 
      valueIndex === index ? text : item
    )
    onChange(newValue)

    if (text.length > 0 && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>, 
    index: number
  ) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
      const newValue = [...value]
      newValue[index - 1] = ""
      onChange(newValue)
    }
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault()
    const pastedData = event.clipboardData.getData("text/plain")
    const pastedArray = pastedData.slice(0, length).split("")
    
    if (pastedArray.length) {
      const newValue = value.map((_, index) => 
        pastedArray[index] || ""
      )
      onChange(newValue)
      inputRefs.current[Math.min(pastedArray.length, length - 1)]?.focus()
    }
  }

  return (
    <div
      className={cn(
        "flex gap-2 items-center justify-center",
        className
      )}
      {...props}
    >
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={ref => {
            if (ref) {
              inputRefs.current[index] = ref
            }
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={value[index] || ""}
          className={cn(
            "w-10 h-12 text-center text-lg font-semibold",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onChange={e => handleChange(e.target.value, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`OTP Input ${index + 1}`}
        />
      ))}
    </div>
  )
}