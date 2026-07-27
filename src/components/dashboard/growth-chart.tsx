"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"

const data = [
  { day: "MON", value: 40 },
  { day: "TUE", value: 60 },
  { day: "WED", value: 45 },
  { day: "THU", value: 80 },
  { day: "FRI", value: 55 },
  { day: "SAT", value: 95 },
  { day: "SUN", value: 70 },
]

export function GrowthChart() {
  // Highlight the peak bar for visual emphasis
  const peakIndex = data.reduce(
    (maxIdx, d, i, arr) => (d.value > arr[maxIdx].value ? i : maxIdx),
    0,
  )

  return (
    <div className="relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low p-8">
      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h4 className="font-display text-lg font-bold text-foreground">
            {"This Week's Growth"}
          </h4>
          <span className="text-lg font-bold text-primary">+12.4%</span>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--outline)", fontSize: 10, fontWeight: 700 }}
                tickMargin={8}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                shape={(props: any) => {
                  const index = data.findIndex((d) => d.value === props.value)
                  const { x, y, width, height } = props

                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={6}
                      ry={6}
                      fill="var(--chart-1)"
                      fillOpacity={index === peakIndex ? 0.55 : 0.25}
                    />
                  )
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-primary/0 via-primary/50 to-primary/0"
        aria-hidden="true"
      />
    </div>
  )
}
