// Order Book Management
class OrderBook {
    constructor() {
        this.asks = [];
        this.bids = [];
        this.init();
    }
    
    init() {
        this.generateInitialOrders();
        this.render();
        this.startUpdates();
    }
    
    generateInitialOrders() {
        const basePrice = 43256.80;
        
        // Generate asks (sell orders)
        for (let i = 10; i > 0; i--) {
            const price = basePrice + i * 10 + Math.random() * 5;
            const amount = Math.random() * 2;
            this.asks.push({
                price,
                amount,
                total: price * amount
            });
        }
        
        // Generate bids (buy orders)
        for (let i = 1; i <= 10; i++) {
            const price = basePrice - i * 10 - Math.random() * 5;
            const amount = Math.random() * 2;
            this.bids.push({
                price,
                amount,
                total: price * amount
            });
        }
    }
    
    render() {
        this.renderAsks();
        this.renderBids();
    }
    
    renderAsks() {
        const container = document.getElementById('orderbookAsks');
        container.innerHTML = '';
        
        // Sort asks by price (ascending)
        this.asks.sort((a, b) => a.price - b.price);
        
        const maxTotal = Math.max(...this.asks.map(o => o.total));
        
        this.asks.forEach(order => {
            const row = document.createElement('div');
            row.className = 'order-row ask';
            
            const widthPercent = (order.total / maxTotal) * 100;
            
            row.innerHTML = `
                <div class="order-background" style="width: ${widthPercent}%"></div>
                <span class="order-price">${order.price.toFixed(2)}</span>
                <span class="order-amount">${order.amount.toFixed(4)}</span>
                <span class="order-total">${order.total.toFixed(2)}</span>
            `;
            
            row.addEventListener('click', () => this.fillPrice(order.price));
            container.appendChild(row);
        });
    }
    
    renderBids() {
        const container = document.getElementById('orderbookBids');
        container.innerHTML = '';
        
        // Sort bids by price (descending)
        this.bids.sort((a, b) => b.price - a.price);
        
        const maxTotal = Math.max(...this.bids.map(o => o.total));
        
        this.bids.forEach(order => {
            const row = document.createElement('div');
            row.className = 'order-row bid';
            
            const widthPercent = (order.total / maxTotal) * 100;
            
            row.innerHTML = `
                <div class="order-background" style="width: ${widthPercent}%"></div>
                <span class="order-price">${order.price.toFixed(2)}</span>
                <span class="order-amount">${order.amount.toFixed(4)}</span>
                <span class="order-total">${order.total.toFixed(2)}</span>
            `;
            
            row.addEventListener('click', () => this.fillPrice(order.price));
            container.appendChild(row);
        });
    }
    
    fillPrice(price) {
        document.getElementById('priceInput').value = price.toFixed(2);
    }
    
    startUpdates() {
        setInterval(() => {
            this.updateOrder();
        }, 2000);
    }
    
    updateOrder() {
        // Randomly update an ask or bid
        if (Math.random() > 0.5) {
            const index = Math.floor(Math.random() * this.asks.length);
            this.asks[index].amount = Math.random() * 2;
            this.asks[index].total = this.asks[index].price * this.asks[index].amount;
        } else {
            const index = Math.floor(Math.random() * this.bids.length);
            this.bids[index].amount = Math.random() * 2;
            this.bids[index].total = this.bids[index].price * this.bids[index].amount;
        }
        
        this.render();
    }
}

// Initialize order book
let orderBook;
document.addEventListener('DOMContentLoaded', () => {
    orderBook = new OrderBook();
});