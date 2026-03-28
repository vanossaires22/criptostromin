// Trading Chart using Canvas
class TradingChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.data = [];
        this.timeframe = '1h';
        
        this.init();
        this.generateData();
        this.animate();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Mouse interactions
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.hideTooltip());
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width - 32;
        this.canvas.height = rect.height - 32;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    generateData() {
        const points = 100;
        let price = 43000;
        
        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * 200;
            price += change;
            this.data.push({
                time: i,
                open: price,
                high: price + Math.random() * 100,
                low: price - Math.random() * 100,
                close: price + (Math.random() - 0.5) * 50,
                volume: Math.random() * 1000
            });
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        if (this.data.length === 0) return;
        
        const padding = 40;
        const chartWidth = this.width - padding * 2;
        const chartHeight = this.height - padding * 2;
        
        // Calculate price range
        const prices = this.data.flatMap(d => [d.high, d.low]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;
        
        // Draw grid
        this.drawGrid(padding, chartWidth, chartHeight, minPrice, maxPrice);
        
        // Draw candles
        const candleWidth = chartWidth / this.data.length * 0.8;
        this.data.forEach((candle, i) => {
            const x = padding + (i / this.data.length) * chartWidth;
            const isGreen = candle.close >= candle.open;
            const color = isGreen ? '#0ecb81' : '#f6465d';
            
            // Wick
            const highY = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
            const lowY = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
            const openY = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
            const closeY = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x + candleWidth / 2, highY);
            this.ctx.lineTo(x + candleWidth / 2, lowY);
            this.ctx.stroke();
            
            // Body
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY) || 1;
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
        });
        
        // Draw price line
        this.ctx.strokeStyle = '#f0b90b';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        this.data.forEach((candle, i) => {
            const x = padding + (i / this.data.length) * chartWidth;
            const y = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
    }
    
    drawGrid(padding, chartWidth, chartHeight, minPrice, maxPrice) {
        this.ctx.strokeStyle = '#2a2e39';
        this.ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            const price = maxPrice - ((maxPrice - minPrice) / 5) * i;
            
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(padding + chartWidth, y);
            this.ctx.stroke();
            
            // Price labels
            this.ctx.fillStyle = '#848e9c';
            this.ctx.font = '12px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`$${price.toFixed(0)}`, padding + chartWidth + 5, y + 4);
        }
        
        // Vertical lines
        for (let i = 0; i <= 10; i++) {
            const x = padding + (chartWidth / 10) * i;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, padding);
            this.ctx.lineTo(x, padding + chartHeight);
            this.ctx.stroke();
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find nearest candle
        const padding = 40;
        const chartWidth = this.width - padding * 2;
        const index = Math.floor(((x - padding) / chartWidth) * this.data.length);
        
        if (index >= 0 && index < this.data.length) {
            this.showTooltip(this.data[index], x, y);
        }
    }
    
    showTooltip(candle, x, y) {
        // Implementation for tooltip
    }
    
    hideTooltip() {
        // Hide tooltip
    }
    
    updateData(newData) {
        this.data = newData;
    }
}

// Initialize chart
let chart;
document.addEventListener('DOMContentLoaded', () => {
    chart = new TradingChart('tradingChart');
});
