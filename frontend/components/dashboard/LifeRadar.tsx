"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// Data Categories (Thai)
const chartData = [
    { subject: "การเงิน", A: 120, fullMark: 150 },
    { subject: "การงาน", A: 98, fullMark: 150 },
    { subject: "สุขภาพ", A: 86, fullMark: 150 },
    { subject: "ความสัมพันธ์", A: 99, fullMark: 150 },
    { subject: "จิตใจ", A: 85, fullMark: 150 },
    { subject: "ปัญญา", A: 65, fullMark: 150 },
]

const chartConfig = {
    desktop: {
        label: "สมดุล",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function LifeRadar() {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="items-center pb-4 text-center">
                <CardTitle className="text-xl font-bold text-foreground">สมดุลชีวิต</CardTitle>
                <CardDescription className="text-muted-foreground">
                    วิเคราะห์ภาพรวมรอบด้าน
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[350px]"
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 13 }} />
                        <PolarGrid gridType="circle" stroke="var(--border)" strokeOpacity={0.4} />
                        <Radar
                            dataKey="A"
                            name="Life Balance"
                            stroke="#1E3A8A" // Navy Blue
                            strokeWidth={2}
                            fill="#D4AF37" // Muted Champagne Gold
                            fillOpacity={0.4}
                            dot={{
                                r: 4,
                                fillOpacity: 1,
                                fill: "#D4AF37",
                            }}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2 font-medium leading-none text-emerald-600">
                    สุขภาพจิตดีขึ้น 5.2% <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    ข้อมูลล่าสุด: วันนี้
                </div>
            </CardFooter>
        </Card>
    )
}
