"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Pipette, Copy, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// --- Color conversion utilities (sin cambios) ---
function hsvToRgb(h, s, v) {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0, g = 0, b = 0

  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max

  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
    else if (max === g) h = ((b - r) / d + 2) * 60
    else h = ((r - g) / d + 4) * 60
  }

  return { h, s, v }
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`
}

function hexToRgb(hex) {
  const cleaned = hex.replace("#", "")
  if (cleaned.length !== 6) return null
  const num = parseInt(cleaned, 16)
  if (isNaN(num)) return null
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

// --- Sub-componentes (sin cambios) ---
function SaturationBrightnessPanel({ hue, saturation, brightness, onChange }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const isDragging = useRef(false)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    const { r, g, b } = hsvToRgb(hue, 1, 1)

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(0, 0, w, h)

    const whiteGrad = ctx.createLinearGradient(0, 0, w, 0)
    whiteGrad.addColorStop(0, "rgba(255,255,255,1)")
    whiteGrad.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = whiteGrad
    ctx.fillRect(0, 0, w, h)

    const blackGrad = ctx.createLinearGradient(0, 0, 0, h)
    blackGrad.addColorStop(0, "rgba(0,0,0,0)")
    blackGrad.addColorStop(1, "rgba(0,0,0,1)")
    ctx.fillStyle = blackGrad
    ctx.fillRect(0, 0, w, h)
  }, [hue])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const handleInteraction = useCallback(
    (clientX, clientY) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height))
      const s = x / rect.width
      const v = 1 - y / rect.height
      onChange(s, v)
    },
    [onChange]
  )

  const handlePointerDown = useCallback(
    (e) => {
      isDragging.current = true
      e.target.setPointerCapture(e.pointerId)
      handleInteraction(e.clientX, e.clientY)
    },
    [handleInteraction]
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging.current) return
      handleInteraction(e.clientX, e.clientY)
    },
    [handleInteraction]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const thumbX = saturation * 100
  const thumbY = (1 - brightness) * 100

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-lg overflow-hidden cursor-crosshair"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <canvas ref={canvasRef} width={256} height={256} className="w-full h-full" />
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(0,0,0,0.1)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${thumbX}%`,
          top: `${thumbY}%`,
        }}
      />
    </div>
  )
}

function HueSlider({ hue, onChange }) {
  const trackRef = useRef(null)
  const isDragging = useRef(false)

  const handleInteraction = useCallback(
    (clientX) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
      onChange((x / rect.width) * 360)
    },
    [onChange]
  )

  const handlePointerDown = useCallback(
    (e) => {
      isDragging.current = true
      e.target.setPointerCapture(e.pointerId)
      handleInteraction(e.clientX)
    },
    [handleInteraction]
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging.current) return
      handleInteraction(e.clientX)
    },
    [handleInteraction]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      ref={trackRef}
      className="relative h-3 rounded-full cursor-pointer"
      style={{
        background:
          "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  )
}

function OpacitySlider({ opacity, color, onChange }) {
  const trackRef = useRef(null)
  const isDragging = useRef(false)

  const handleInteraction = useCallback(
    (clientX) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
      onChange(x / rect.width)
    },
    [onChange]
  )

  const handlePointerDown = useCallback(
    (e) => {
      isDragging.current = true
      e.target.setPointerCapture(e.pointerId)
      handleInteraction(e.clientX)
    },
    [handleInteraction]
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging.current) return
      handleInteraction(e.clientX)
    },
    [handleInteraction]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      ref={trackRef}
      className="relative h-3 rounded-full cursor-pointer overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: "8px 8px",
          backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(to right, transparent, ${color})`,
        }}
      />
      <div
        className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${opacity * 100}%`,
          backgroundColor: color,
        }}
      />
    </div>
  )
}

// --- Main ColorPicker component (controlado) ---
export function ColorPicker({
  value = "#3B82F6",
  opacity: propOpacity = 1,
  onChange,
  showOpacity = true,
}) {
  // Inicializar estado interno desde las props
  const initialRgb = hexToRgb(value) ?? { r: 59, g: 130, b: 246 }
  const initialHsv = rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b)

  const [hue, setHue] = useState(initialHsv.h)
  const [saturation, setSaturation] = useState(initialHsv.s)
  const [brightness, setBrightness] = useState(initialHsv.v)
  const [opacity, setOpacity] = useState(showOpacity ? propOpacity : 1)
  const [hexInput, setHexInput] = useState(value.toUpperCase())
  const [copied, setCopied] = useState(false)

  // Sincronizar estado interno cuando cambian las props externas
  useEffect(() => {
    const rgb = hexToRgb(value) ?? { r: 59, g: 130, b: 246 }
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    setHue(hsv.h)
    setSaturation(hsv.s)
    setBrightness(hsv.v)
    setHexInput(value.toUpperCase())
  }, [value])

  useEffect(() => {
    if (showOpacity) {
      setOpacity(propOpacity)
    }
  }, [propOpacity, showOpacity])

  const rgb = hsvToRgb(hue, saturation, brightness)
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
  const solidColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const colorWithOpacity = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.toFixed(2)})`

  // Notificar cambios al padre - solo desde interacciones, no en cada render
  const handleColorChange = useCallback((newHue, newSaturation, newBrightness) => {
    const newRgb = hsvToRgb(newHue, newSaturation, newBrightness)
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    onChange?.(newHex, opacity)
  }, [opacity, onChange])

  const handleSaturationBrightnessChange = useCallback((s, v) => {
    setSaturation(s)
    setBrightness(v)
    handleColorChange(hue, s, v)
  }, [hue, handleColorChange])

  const handleHueChange = useCallback((newHue) => {
    setHue(newHue)
    handleColorChange(newHue, saturation, brightness)
  }, [saturation, brightness, handleColorChange])

  const handleOpacityChange = useCallback((newOpacity) => {
    setOpacity(newOpacity)
    const newRgb = hsvToRgb(hue, saturation, brightness)
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    onChange?.(newHex, newOpacity)
  }, [hue, saturation, brightness, onChange])

  const handleHexChange = (inputValue) => {
    const cleaned = inputValue.startsWith("#") ? inputValue : `#${inputValue}`
    setHexInput(cleaned.toUpperCase())

    const parsed = hexToRgb(cleaned)
    if (parsed) {
      const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b)
      setHue(hsv.h)
      setSaturation(hsv.s)
      setBrightness(hsv.v)
      onChange?.(cleaned, opacity)
    }
  }

  const handleCopy = async () => {
    const text = showOpacity && opacity < 1
      ? `${hex}${Math.round(opacity * 255).toString(16).padStart(2, "0").toUpperCase()}`
      : hex.toUpperCase()

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="group flex justify-between items-center w-full gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-all hover:shadow-md hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open color picker"
        >
          <div className="relative w-9 h-9 border rounded-lg overflow-hidden shadow-inner">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: "8px 8px",
                backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
              }}
            />
            <div
              className="absolute inset-0 rounded-lg"
              style={{ backgroundColor: colorWithOpacity }}
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold text-foreground tracking-wide font-mono">
              {hex.toUpperCase()}
            </span>
            {showOpacity && (
              <span className="text-[10px] text-muted-foreground">
                {Math.round(opacity * 100)}% opacity
              </span>
            )}
          </div>
          <Pipette className="ml-1 w-4 h-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 p-0 rounded-xl border-border/60 bg-popover shadow-xl"
        sideOffset={8}
      >
        <div className="flex flex-col gap-4 p-4">
          <SaturationBrightnessPanel
            hue={hue}
            saturation={saturation}
            brightness={brightness}
            onChange={handleSaturationBrightnessChange}
          />

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium text-popover-foreground/70 uppercase tracking-wider">
              Hue
            </label>
            <HueSlider hue={hue} onChange={handleHueChange} />
          </div>

          {showOpacity && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-popover-foreground/70 uppercase tracking-wider">
                  Opacity
                </label>
                <span className="text-[11px] font-mono text-popover-foreground/50">
                  {Math.round(opacity * 100)}%
                </span>
              </div>
              <OpacitySlider
                opacity={opacity}
                color={solidColor}
                onChange={handleOpacityChange}
              />
            </div>
          )}

          <div className="h-px bg-border/40" />

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-popover-foreground/40 font-mono">
                HEX
              </span>
              <input
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                maxLength={7}
                className="w-full h-9 rounded-lg bg-popover-foreground/5 border border-border/30 pl-11 pr-3 text-xs font-mono text-popover-foreground placeholder:text-popover-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring/50 transition-colors"
                placeholder="#000000"
                spellCheck={false}
              />
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-lg transition-all",
                copied
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-popover-foreground/5 text-popover-foreground/50 hover:text-popover-foreground hover:bg-popover-foreground/10"
              )}
              aria-label="Copy color code"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showOpacity && (
            <div className="flex items-center gap-3">
              <div className="relative flex-1 h-8 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #ccc 25%, transparent 25%),
                      linear-gradient(-45deg, #ccc 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #ccc 75%),
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)
                    `,
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: colorWithOpacity }}
                />
              </div>
              <span className="text-[10px] font-mono text-popover-foreground/40 shrink-0">
                {`rgba(${rgb.r},${rgb.g},${rgb.b},${opacity.toFixed(2)})`}
              </span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}