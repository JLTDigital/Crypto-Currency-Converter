const currencyBtn = document.getElementById('btn'),
  holdingsBtn = document.getElementById('holdings-btn'),
  addBtn = document.getElementById('add-btn'),
  closeBtn = document.getElementById('close-btn'),
  currencyOneSelect = document.getElementById('currency-one'),
  currencyTwoSelect = document.getElementById('currency-two'),
  currencyOneInput = document.getElementById('amount-one'),
  currencyTwoInput = document.getElementById('amount-two'),
  info = document.getElementById('info-container'),
  holdingSection = document.getElementById('holdings-section'),
  cryptoholding = document.getElementById('crypto-tag'),
  warning = document.querySelector('.warning-text'),
  holdings = document.getElementById('collection'),
  inputBox = document.getElementById('input-box');
 
  // Fetch the prices
  function getRatesInfo() {
    const crypto = currencyOneSelect.value;
    const currency = currencyTwoSelect.value;

   fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${crypto}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
      .then(res => res.json())  
      .then(data => {

      const cryptoRate = data[0].current_price;
      currencyTwoInput.value = (currencyOneInput.value * cryptoRate).toFixed(2);
    })
      getInfo();
  }

  // Data for the info section
  async function getInfo() {
    const crypto = currencyOneSelect.value;
    const currency = currencyTwoSelect.value;

    await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${crypto}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
      .then(res => res.json())  
      .then(data => {
      info.innerHTML = `
        <div id="crypto-image" class="crypto-img">
          <img src="${data[0].image}" alt="">
        </div>
        <ul class="list">
          <li class="info-list">${data[0].symbol.toUpperCase()}</li>
          <br>
          <li class="info-list">Name: ${data[0].name}</li>
          <li class="info-list">Current Price: ${data[0].current_price}</li>
          <li class="info-list">Market Cap: ${data[0].market_cap}</li>
          <li class="info-list">Market Cap Rank: ${data[0].market_cap_rank}</li>
          <br>
          <li class="info-list">24hr High: ${data[0].high_24h}</li>
          <li class="info-list">24hr Low: ${data[0].low_24h}</li>
          <li class="info-list">24hr Price Change: ${data[0].price_change_24h}</li>
          <li class="info-list">24hr Price Percentage: ${data[0].price_change_percentage_24h.toFixed(2)}%</li>
          <br>
          <li class="info-list">Circulating Supply: ${data[0].circulating_supply}</li>
        </ul>
      `;
    })
  }

  //  Display warning or Add cryto to collection
  function AddCrypto() {
    if(cryptoholding.value === '') {
      warning.classList.add('warning');
      setTimeout(() => {
        warning.classList.remove('warning');
      }, 3000);
    } else {
      createHolding();
    }
  }

  // Create Crypto 
  function createHolding() {
    const li = document.createElement('li');
      li.className = 'list-item';
      li.appendChild(document.createTextNode(`${cryptoholding.value.toUpperCase()}`));
      const link = document.createElement('a');
      link.className = 'delete-item';
      li.appendChild(link);
      link.innerHTML = '<i class="far fa-trash-alt delete-item"></i>';
      holdings.appendChild(li)

      setLocalStorage(li.innerText)

      cryptoholding.value = '';
  }
  
  // Remove crypto from collection
  function removeCrypto(e) {
    if(e.target.parentElement.classList.contains('delete-item')) {
      e.target.parentElement.parentElement.remove();

      removeFromLocalStorage(e.target.parentElement.parentElement);
    }
  }

  // Set Local Storage
  function setLocalStorage(holding) {
    let cryptoStorage;
    if(localStorage.getItem('holding') === null) {
      cryptoStorage = [];
    } else {
      cryptoStorage = JSON.parse(localStorage.getItem('holding'));
    }

    cryptoStorage.push(holding);

    localStorage.setItem('holding', JSON.stringify(cryptoStorage));
  }

  // Get crypto from Local Storage
  function getCrypto() {
    let cryptoStorage;
    if(localStorage.getItem('holding') === null) {
      cryptoStorage = [];
    } else {
      cryptoStorage = JSON.parse(localStorage.getItem('holding'));
    }

    cryptoStorage.forEach((holding) => {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.appendChild(document.createTextNode(holding));
      const link = document.createElement('a');
      link.className = 'delete-item';
      li.appendChild(link);
      link.innerHTML = '<i class="far fa-trash-alt delete-item"></i>';
      holdings.appendChild(li)
    });
  }

  // Remove from Local storage
  function removeFromLocalStorage(cryptoItem) {
    let cryptoStorage;
    if(localStorage.getItem('holding') === null) {
      cryptoStorage = [];
    } else {
      cryptoStorage = JSON.parse(localStorage.getItem('holding'));
    }

    cryptoStorage.forEach((holding, index) => {
      if(cryptoItem.innerText === holding) {
        cryptoStorage.splice(index, 1);
      }
    });

    localStorage.setItem('holding', JSON.stringify(cryptoStorage))
  }


  // Event Listener - Remove from holdings
  holdings.addEventListener('click', removeCrypto);

  // Event Listener - Add crypto to holdings
  addBtn.addEventListener('click', AddCrypto);

  // Event Litener - Show the holdings section
  holdingsBtn.addEventListener('click', () => {
    holdingSection.classList.add('show')
  });

  // Close Holdings Section
  closeBtn.addEventListener('click', () => {
    holdingSection.classList.remove('show')
  });

  // Get from Local Storage
  document.addEventListener('DOMContentLoaded', getCrypto);
  
  // Event Listener - Currency Selecters
  currencyOneSelect.addEventListener('change', getRatesInfo);
  currencyTwoSelect.addEventListener('change', getRatesInfo);

  // Event Listener - Main Input
  currencyOneInput.addEventListener('input', getRatesInfo);
  currencyTwoInput.addEventListener('input', getRatesInfo);

  // Event Listener - Get Prices Button
  currencyBtn.addEventListener('click', getRatesInfo);
