import React from "react";
import { AreaChart, XAxis, YAxis, Area } from "recharts";
import { getCurrencyPrices } from "./priceRequest"; 

const HEIGHT = 200;
const WIDTH = 600;
let prices;

export const Chart = ({coin}) => {
    getCurrencyPrices(coin).then((result) => {prices = result});
    return (
      <AreaChart width={WIDTH} height={HEIGHT} data={prices}>
        <XAxis dataKey="time"/>
        <YAxis />
        <Area dataKey="close"
            stroke="blue"
            fill="blue" 
            type="monotone"
            name="BTC price change"
            />
      </AreaChart>
    );
};
