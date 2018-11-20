import React, { Component } from 'react';
import './Rates.css';
import * as utils from "../utils";
import * as payment from '../payments';

export default class Rates extends Component {
  componentDidMount() {
    utils.statReachGoal('rates');
  }

  render() {
    return (
      <div className="Status__wrap">
        <div className="Rates">
          <div className="Rates__title">{utils.availChatsStr(this.props.state.availChats)}</div>
          <div className="Rates__caption">Количество показывает, сколько раз ты можешь общаться с новыми людьми. Заходи каждый день<br/>и получай по {payment.FREE_CHATS} чатов. Или увеличь вручную.</div>
          <div className="Rates__items">
            {this._renderRates()}
          </div>
        </div>
      </div>
    )
  }

  _renderRates() {
    return [{
      rateId: 'one',
      count: 10,
      price: 3
    }, {
      rateId: 'two',
      count: 30,
      price: 7
    }, {
      rateId: 'three',
      count: 100,
      price: 19
    }].map((rate) => {
      return (
        <div className="Rates__item" key={rate.count} onClick={() => this.props.showOrder(rate.rateId, rate.count)}>
          <div className="Rates__item__count">{rate.count}</div>
          <div className="Rates__item__count-str">{utils.gram(rate.count, ['чат', 'чата', 'чатов'], true)}</div>
          <div className="Rates__item__separator" />
          <div className="Rates__item__price">{utils.gram(rate.price, ['голос', 'голоса', 'голосов'])}</div>
          <div className="Rates__item__button">Получить</div>
        </div>
      )
    });
  }
}