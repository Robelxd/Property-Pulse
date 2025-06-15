
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'
import { TrendingUp, TrendingDown, Home, DollarSign, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const MarketTrends = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedLocation, setSelectedLocation] = useState('san-francisco')

  const marketData = {
    '6months': [
      { month: 'Aug', avgPrice: 920000, sales: 145, inventory: 280 },
      { month: 'Sep', avgPrice: 935000, sales: 158, inventory: 265 },
      { month: 'Oct', avgPrice: 950000, sales: 162, inventory: 250 },
      { month: 'Nov', avgPrice: 945000, sales: 140, inventory: 275 },
      { month: 'Dec', avgPrice: 960000, sales: 125, inventory: 290 },
      { month: 'Jan', avgPrice: 975000, sales: 138, inventory: 285 }
    ],
    '1year': [
      { month: 'Feb 23', avgPrice: 850000, sales: 180, inventory: 320 },
      { month: 'Apr 23', avgPrice: 870000, sales: 195, inventory: 310 },
      { month: 'Jun 23', avgPrice: 890000, sales: 210, inventory: 295 },
      { month: 'Aug 23', avgPrice: 920000, sales: 185, inventory: 280 },
      { month: 'Oct 23', avgPrice: 950000, sales: 162, inventory: 250 },
      { month: 'Dec 23', avgPrice: 960000, sales: 125, inventory: 290 },
      { month: 'Jan 24', avgPrice: 975000, sales: 138, inventory: 285 }
    ]
  }

  const neighborhoodData = [
    { name: 'Downtown', avgPrice: 1200000, change: 8.5, inventory: 45 },
    { name: 'Mission District', avgPrice: 950000, change: 12.3, inventory: 62 },
    { name: 'Marina', avgPrice: 1450000, change: 5.2, inventory: 28 },
    { name: 'SOMA', avgPrice: 1100000, change: 15.8, inventory: 38 },
    { name: 'Castro', avgPrice: 1050000, change: 7.9, inventory: 41 },
    { name: 'Richmond', avgPrice: 850000, change: 6.1, inventory: 55 }
  ]

  const priceDistribution = [
    { range: 'Under 500k', count: 12 },
    { range: '500k-750k', count: 28 },
    { range: '750k-1M', count: 45 },
    { range: '1M-1.5M', count: 38 },
    { range: '1.5M-2M', count: 22 },
    { range: 'Over 2M', count: 15 }
  ]

  const currentData = marketData[selectedTimeframe as keyof typeof marketData]

  const chartConfig = {
    avgPrice: {
      label: "Average Price",
      color: "#3b82f6",
    },
    sales: {
      label: "Sales Volume",
      color: "#10b981",
    },
    inventory: {
      label: "Inventory",
      color: "#f59e0b",
    },
    count: {
      label: "Properties",
      color: "#8b5cf6",
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Market Trends & Reports</h2>
          <p className="text-muted-foreground">Real estate market analysis and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="san-francisco">San Francisco</SelectItem>
              <SelectItem value="oakland">Oakland</SelectItem>
              <SelectItem value="san-jose">San Jose</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Median Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$975,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +6.0% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Volume</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">138</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +10.4% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days on Market</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -3 days from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -1.7% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Price Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price Trends</CardTitle>
          <CardDescription>Average property prices over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="avgPrice" 
                  stroke="var(--color-avgPrice)"
                  fill="var(--color-avgPrice)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Neighborhood Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Neighborhood Comparison</CardTitle>
            <CardDescription>Average prices and market changes by area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {neighborhoodData.map((neighborhood) => (
                <div key={neighborhood.name} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{neighborhood.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${neighborhood.avgPrice.toLocaleString()} avg • {neighborhood.inventory} listings
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`flex items-center text-sm ${neighborhood.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {neighborhood.change > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {neighborhood.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
            <CardDescription>Number of properties by price range</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceDistribution}>
                  <XAxis dataKey="range" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MarketTrends
