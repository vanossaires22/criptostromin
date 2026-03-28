// Main Application
class CryptoExchange {
    constructor() {
        this.balance = 10245.80;
        this.currentPair = 'BTC/USDT';
        this.currentPrice = 43256.80;
        this.orders = [];
        this.trades = [];
        this.tradeType = 'buy';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateBalance();
        this.startPriceSimulation();
        this.generateInitialData();
    }
    
    setupEventListeners() {
        // Trade tabs
        document.querySelectorAll('.trade-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.trade-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.tradeType = e.target.dataset.type;
                this.updateTradeButton();
            });
        });
        
        // Order type change
        document.getElementById('orderType').addEventListener('change', (e) => {
            const priceGroup = document.getElementById('priceGroup');
            if (e.target.value === 'market') {
                priceGroup.style.display = 'none';
            } else {
                priceGroup.style.display = 'block';
            }
        });
        
        // Price and amount inputs
        const priceInput = document.getElementById('priceInput');
        const amountInput = document.getElementById('amountInput');
        const totalInput = document.getElementById('totalInput');
        
        priceInput.addEventListener('input', () => {
            const price = parseFloat(priceInput.value) || 0;
            const amount = parseFloat(amountInput.value) || 0;
            totalInput.value = (price * amount).toFixed(2);
        });
        
        amountInput.addEventListener('input', () => {
            const price = parseFloat(priceInput.value) || this.currentPrice;
            const amount = parseFloat(amountInput.value) || 0;
            totalInput.value = (price * amount).toFixed(2);
        });
        
        // Percentage slider
        document.getElementById('percentageSlider').addEventListener('input', (e) => {
            const percentage = e.target.value / 100;
            const price = parseFloat(priceInput.value) || this.currentPrice;
            const maxAmount = this.tradeType === 'buy' 
                ? (this.balance * percentage) / price
                : this.getBTGBalance() * percentage;
            
            amountInput.value = maxAmount.toFixed(4);
            totalInput.value = (price * maxAmount).toFixed(2);
        });
        
        // Trade form submission
        document.getElementById('tradeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitOrder();
        });
        
        // Connect wallet
        document.getElementById('connectWallet').addEventListener('click', () => {
            this.connectWallet();
        });
        
        // Timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.changeTimeframe(e.target.dataset.time);
            });
        });
        
        // Trade filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterTrades(e.target.dataset.filter);
            });
        });
    }
    
    updateTradeButton() {
        const btn = document.getElementById('tradeButton');
        if (this.tradeType === 'buy') {
            btn.textContent = 'Купить BTC';
            btn.className = 'btn btn-trade btn-buy';
            document.getElementById('availableBalance').textContent = `${this.balance.toFixed(2)} USDT`;
        } else {
            btn.textContent = 'Продать BTC';
            btn.className = 'btn btn-trade btn-sell';
            document.getElementById('availableBalance').textContent = `${this.getBTGBalance().toFixed(4)} BTC`;
        }
    }
    
    getBTGBalance() {
        // Mock BTC balance
        return 0.2345;
    }
    
    submitOrder() {
        const price = parseFloat(document.getElementById('priceInput').value) || this.currentPrice;
        const amount = parseFloat(document.getElementById('amountInput').value);
        const total = parseFloat(document.getElementById('totalInput').value);
        
        if (!amount || amount <= 0) {
            this.showNotification('Введите корректное количество', 'error');
            return;
        }
        
        if (this.tradeType === 'buy' && total > this.balance) {
            this.showNotification('Недостаточно средств', 'error');
            return;
        }
        
        // Create order
        const order = {
            id: Date.now(),
            pair: this.currentPair,
            type: this.tradeType,
            price: price,
            amount: amount,
            filled: 0,
            status: 'open',
            time: new Date().toLocaleString()
        };
        
        this.orders.push(order);
        
        // Update balance
        if (this.tradeType === 'buy') {
            this.balance -= total;
        }
        
        this.updateBalance();
        this.renderOrders();
        this.showNotification(`Ордер на ${this.tradeType === 'buy' ? 'покупку' : 'продажу'} ${amount.toFixed(4)} BTC создан`, 'success');
        
        // Clear form
        document.getElementById('amountInput').value = '';
        document.getElementById('totalInput').value = '';
        document.getElementById('percentageSlider').value = 0;
    }
    
    cancelOrder(orderId) {
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            const order = this.orders[index];
            if (order.type === 'buy') {
                this.balance += order.price * order.amount;
            }
            this.orders.splice(index, 1);
            this.updateBalance();
            this.renderOrders();
            this.showNotification('Ордер отменен', 'success');
        }
    }
    
    updateBalance() {
        document.getElementById('totalBalance').textContent = `$${this.balance.toFixed(2)}`;
    }
    
    renderOrders() {
        const tbody = document.getElementById('openOrdersBody');
        tbody.innerHTML = '';
        
        this.orders.forEach(order => {
            const row = document.createElement('div');
            row.className = 'order-row-item';
            row.innerHTML = `
                <span>${order.time}</span>
                <span>${order.pair}</span>
                <span class="${order.type === 'buy' ? 'positive' : 'negative'}">${order.type === 'buy' ? 'Buy' : 'Sell'}</span>
                <span>${order.price.toFixed(2)}</span>
                <span>${order.amount.toFixed(4)}</span>
                <span>${((order.filled / order.amount) * 100).toFixed(2)}%</span>
                <button class="cancel-btn" onclick="app.cancelOrder(${order.id})">Отмена</button>
            `;
            tbody.appendChild(row);
        });
    }
    
    connectWallet() {
        // Mock wallet connection
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('userMenu').style.display = 'flex';
        this.showNotification('Кошелек успешно подключен', 'success');
    }
    
    startPriceSimulation() {
        setInterval(() => {
            const change = (Math.random() - 0.5) * 100;
            this.currentPrice += change;
            document.getElementById('currentPrice').textContent = `$${this.currentPrice.toFixed(2)}`;
            document.getElementById('spreadPrice').textContent = this.currentPrice.toFixed(2);
            
            // Update price change
            const changePercent = (change / this.currentPrice) * 100;
            const changeElement = document.getElementById('priceChange');
            changeElement.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
            changeElement.className = `price-change ${changePercent >= 0 ? 'positive' : 'negative'}`;
        }, 3000);
    }
    
    generateInitialData() {
        // Generate mock trades
        for (let i = 0; i < 20; i++) {
            this.addRandomTrade();
        }
    }
    
    addRandomTrade() {
        const price = this.currentPrice + (Math.random() - 0.5) * 200;
        const amount = Math.random() * 0.5;
        const type = Math.random() > 0.5 ? 'buy' : 'sell';
        const time = new Date().toLocaleTimeString();
        
        const trade = {
            time,
            price,
            amount,
            total: price * amount,
            type
        };
        
        this.trades.unshift(trade);
        if (this.trades.length > 50) this.trades.pop();
        
        this.renderTrades();
    }
    
    renderTrades() {
        const tbody = document.getElementById('tradesBody');
        tbody.innerHTML = '';
        
        this.trades.forEach(trade => {
            const row = document.createElement('div');
            row.className = 'trade-row';
            row.innerHTML = `
                <span>${trade.time}</span>
                <span class="${trade.type === 'buy' ? 'positive' : 'negative'}">${trade.price.toFixed(2)}</span>
                <span>${trade.amount.toFixed(4)}</span>
                <span>${trade.total.toFixed(2)}</span>
            `;
            tbody.appendChild(row);
        });
    }
    
    filterTrades(filter) {
        // Implement filtering logic
        this.renderTrades();
    }
    
    changeTimeframe(timeframe) {
        this.showNotification(`Переключено на ${timeframe}`, 'success');
        // Implement chart timeframe change
    }
    
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CryptoExchange();
});