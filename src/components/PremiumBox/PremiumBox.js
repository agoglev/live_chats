import React, { Component } from 'react';
import './PremiumBox.css';
import * as payment from "../../payments";
import SVG from 'react-inlinesvg';
import emitter from "../../services/emitter";

export default class PremiumBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSuccessShown: false
    };
  }

  render() {
    if (this.state.isSuccessShown) {
      return this._renderSuccess();
    }

    return (
      <div className="PremiumBox">
        <div className="PremiumBox__header">
          <div className="PremiumBox__close" onClick={this._hide}>
            <SVG src={require('../../asset/back_24.svg')} />
          </div>
          <div className="PremiumBox__user_wrap">
            <div className="PremiumBox__user" style={{backgroundImage: `url(${this.props.state.vkInfo.photo_200})`}} />
            <div className="PremiumBox__vip_badge">
              <div className="PremiumBox__vip_badge__icon">
                <SVG src={require('../../asset/fave_16.svg')} />
              </div>
              <div className="PremiumBox__vip_badge__text">VIP</div>
            </div>
          </div>
          <div className="PremiumBox__vip__caption">Стань круче с новыми возможностями!</div>
        </div>
        <div className="PremiumBox__items">
          <div className="PremiumBox__item">
            <div className="PremiumBox__item__icon orange">
              <SVG src={require('../../asset/star_24.svg')} />
            </div>
            <div className="PremiumBox__item__cont">
              <div className="PremiumBox__item__title">Отметка VIP в анкете</div>
              <div className="PremiumBox__item__caption">Тебя будут реже пропускать</div>
            </div>
          </div>
          <div className="PremiumBox__item">
            <div className="PremiumBox__item__icon blue">
              <SVG src={require('../../asset/filter_24.svg')} />
            </div>
            <div className="PremiumBox__item__cont">
              <div className="PremiumBox__item__title">Фильтр собеседников</div>
              <div className="PremiumBox__item__caption">Находи людей по полу и возрасту</div>
            </div>
          </div>
          <div className="PremiumBox__item">
            <div className="PremiumBox__item__icon green">
              <SVG src={require('../../asset/appearance_24.svg')} />
            </div>
            <div className="PremiumBox__item__cont">
              <div className="PremiumBox__item__title">Темы оформления (скоро)</div>
              <div className="PremiumBox__item__caption">Сделай рулетку любимого цвета</div>
            </div>
          </div>
        </div>
        <div className="PremiumBox__button_wrap">
          <div className="Status__into__button" onClick={this._pay}>Получить за 29 ₽ / мес</div>
        </div>
      </div>
    )
  }

  _renderSuccess = () => {
    return (
      <div className="PremiumBox__success">
        <div className="PremiumBox__success_cont">
          <div className="PremiumBox__user_wrap">
            <div className="PremiumBox__user" style={{backgroundImage: `url(${this.props.state.vkInfo.photo_200})`}} />
            <div className="PremiumBox__vip_badge">
              <div className="PremiumBox__vip_badge__icon">
                <SVG src={require('../../asset/fave_16_white.svg')} />
              </div>
              <div className="PremiumBox__success__vip_badge__text">VIP</div>
            </div>
          </div>
          <div className="PremiumBox__success_title">Добро пожаловать в мир избранных!</div>
          <div className="PremiumBox__success_button_wrap">
            <div className="Status__into__button" onClick={this._hide}>Закрыть</div>
          </div>
        </div>
      </div>
    )
  };

  _pay = () => {
    payment.vkPayRequest().then(() => {
      this.props.setHashPremium();
      this.setState({isSuccessShown: true});
    }).catch(() => alert('Ошибка'));
  };

  _hide = () => {
    emitter.emit('togglePremiumBox');
  };
}
