import { useEffect, useState } from 'react';
import cheerio from 'cheerio';
import axios from 'axios';
import clsx from 'clsx';
import './App.css';
import up from './assets/up.mp3';
import down from './assets/down.mp3';

const url = "https://query1.finance.yahoo.com/v8/finance/chart/GME?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance"
const url2 = 'https://finance.yahoo.com/quote/GME/';
function App() {
  const [price, setPrice] = useState(0)
  const [direction, setDirection] = useState(0);
  const upAudio = new Audio(up);
  const downAudio = new Audio(down);

  const playSound = (audio) => {
    audio.play();
  }

  const getGME = async () => {
    const { data } = await axios.get(url2);
    return cheerio.load(data);
  }

  const findPrice = async () => {
    const $ = await getGME();
    const priceComponent = $('span[data-reactid="32"]').text();
    const marketPrice = priceComponent.replace('FinancialsFull screen', '')
    compare(price, marketPrice);
    setPrice(marketPrice);
  }

  const compare = (price, marketPrice) => {
    if (price > marketPrice) {
      playSound(downAudio)
      return setDirection(-1)
    }
    if (price < marketPrice) {
      playSound(upAudio)
      return setDirection(1)
    }
    return setDirection(0)
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await findPrice();
    }, 1000)
    return () => clearInterval(interval)
  })
  return (
    <div className={clsx("App", direction > 0 ? 'up' : 'down')}>
      <h1 className="rocket">🚀</h1>
      <div>
        <h2>GME (GameStop Corp.)</h2>
        <h1>{price}</h1>
      </div>
    </div>
  );
}

export default App;
