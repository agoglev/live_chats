import React, { Component } from 'react';
import './Settings.css';

export default class Rates extends Component {
  render() {
    return (
      <div className="Page__wrap">
        <div className="Settings__rows">
          <a href="https://vk.me/rouletteapp" target="_blank" className="Settings__row">Сообщить о проблеме</a>
          <a href="https://vk.com/rouletteapp" target="_blank" className="Settings__row">Сообщество приложения</a>
        </div>
      </div>
    )
  }
}
