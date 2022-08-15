import axios from 'axios';

/**
   * This function retunrs current price of crypto asset 
   * @param {string} coin [a cryptocyrrency which price we want to obtain]
   * @returns {int} [current price of chosen coin]  
   */

export const getCurrencyPrice = async (coin) => {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD`);
  return response.data.USD;
}

export const getCurrencyPrices = async (coin) => {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coin}&tsym=USD&limit=30&aggregate=3&e=CCCAGG`);
  const arr = response.data.Data.Data;
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      let _time = new Date(obj.time);
      let hours = String(_time.getHours());
      let minutes = String(_time.getMinutes());
      if ( hours.length == 1 ) { hours = '0' + hours }
      if ( minutes.length == 1 ) { minutes = '0' + minutes }
      obj.time = hours + ":" + minutes;
    }
  return response.data.Data.Data;
}