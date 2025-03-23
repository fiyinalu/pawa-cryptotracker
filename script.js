const container = document.getElementById('crypto-container');
const searchInput = document.getElementById('search');
const toggleButton = document.getElementById('toggleMode');

let coins = [];

// Fetch data from CoinGecko API
async function fetchData() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true');
    const data = await response.json();
    coins = data;
    displayCoins(coins);
}

function displayCoins(coinList) {
    container.innerHTML = '';
    coinList.forEach(coin => {
        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.innerHTML = `
            <img src="${coin.image}" alt="${coin.name} logo">
            <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
            <p>Price: $${coin.current_price.toLocaleString()}</p>
            <canvas class="sparkline" id="sparkline-${coin.id}"></canvas>
        `;
        container.appendChild(card);
        drawSparkline(coin.sparkline_in_7d.price, `sparkline-${coin.id}`);
    });
}

// Search functionality
searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(searchValue) ||
        coin.symbol.toLowerCase().includes(searchValue)
    );
    displayCoins(filteredCoins);
});

// Dark/light mode toggle
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Draw sparkline
function drawSparkline(data, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 50;

    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--blue');
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = (index / data.length) * canvas.width;
        const y = canvas.height - (point / Math.max(...data)) * canvas.height;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
}

// Initialize
fetchData();
