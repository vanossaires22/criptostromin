// Trading Logic and Validations
class TradingManager {
    constructor() {
        this.minTradeAmount = 0.0001;
        this.maxTradeAmount = 100;
        this.feeRate = 0.001; // 0.1%
    }
    
    validateOrder(type, price, amount, balance) {
        const errors = [];
        
        if (!amount || amount < this.minTradeAmount) {
            errors.push(`Минимальная сумма: ${this.minTradeAmount} BTC`);
        }
        
        if (amount > this.maxTradeAmount) {
            errors.push(`Максимальная сумма: ${this.maxTradeAmount} BTC`);
        }
        
        const total = price * amount;
        const fee = total * this.feeRate;
        const totalWithFee = type === 'buy' ? total + fee : total - fee;
        
        if (type === 'buy' && totalWithFee > balance) {
            errors.push('Недостаточно средств');
        }
        
        return {
            valid: errors.length === 0,
            errors,
            total,
            fee
        };
    }
    
    calculateFee(amount, price) {
        const total = amount * price;
        return {
            fee: total * this.feeRate,
            total: total,
            net: total - (total * this.feeRate)
        };
    }
    
    getPriceImpact(amount, orderBook) {
        // Calculate slippage
        let remaining = amount;
        let totalCost = 0;
        
        for (const order of orderBook) {
            if (remaining <= 0) break;
            
            const fillAmount = Math.min(remaining, order.amount);
            totalCost += fillAmount * order.price;
            remaining -= fillAmount;
        }
        
        const avgPrice = totalCost / amount;
        const currentPrice = orderBook[0]?.price || 0;
        const impact = ((avgPrice - currentPrice) / currentPrice) * 100;
        
        return {
            avgPrice,
            impact: Math.abs(impact),
            totalCost
        };
    }
}

// Initialize trading manager
const tradingManager = new TradingManager();