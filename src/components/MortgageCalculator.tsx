
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator } from 'lucide-react'

const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState(500000)
  const [downPayment, setDownPayment] = useState(100000)
  const [loanTerm, setLoanTerm] = useState(30)
  const [interestRate, setInterestRate] = useState(6.5)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)

  const calculateMortgage = () => {
    const principal = homePrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setMonthlyPayment(0)
      setTotalInterest(0)
      setTotalPayment(0)
      return
    }

    const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                   (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const total = monthly * numberOfPayments
    const interest = total - principal

    setMonthlyPayment(monthly)
    setTotalInterest(interest)
    setTotalPayment(total)
  }

  useEffect(() => {
    calculateMortgage()
  }, [homePrice, downPayment, loanTerm, interestRate])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatCurrencyDecimal = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="homePrice">Home Price</Label>
              <Input
                id="homePrice"
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                placeholder="500000"
              />
            </div>
            
            <div>
              <Label htmlFor="downPayment">Down Payment</Label>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                placeholder="100000"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {homePrice > 0 ? `${((downPayment / homePrice) * 100).toFixed(1)}% of home price` : ''}
              </p>
            </div>
            
            <div>
              <Label htmlFor="loanTerm">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                placeholder="30"
              />
            </div>
            
            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                placeholder="6.5"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Monthly Payment</h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrencyDecimal(monthlyPayment)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm text-muted-foreground">Loan Amount</h4>
                <p className="text-lg font-semibold">
                  {formatCurrency(homePrice - downPayment)}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm text-muted-foreground">Total Interest</h4>
                <p className="text-lg font-semibold">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-muted-foreground">Total Payment</h4>
              <p className="text-lg font-semibold">
                {formatCurrency(totalPayment)}
              </p>
            </div>

            <Button 
              onClick={calculateMortgage} 
              className="w-full"
              variant="outline"
            >
              Recalculate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MortgageCalculator
