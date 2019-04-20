import React, { Component } from 'react';
import SVG from 'react-inlinesvg';
import './Settings.css';
import connect from '@vkontakte/vkui-connect';

export default class Settings extends Component {
  render() {
    return (
      <div className="Page__wrap">
        <div className="Settings__rows">
          <div className="Settings__row" onClick={this.props.showFilters}>
            <div className="Settings__row__icon">
              <SVG src={require('../../asset/filter_24.svg')} />
            </div>
            <div className="Settings__row__label">Фильтр собеседников</div>
            <div className="Settings__row__badge">VIP</div>
          </div>

          {/*<div className="Settings__row" onClick={() => connect.send('VKWebAppAddToFavorites', {})}>
            <div className="Settings__row__icon">
              <SVG src={require('../../asset/star_24.svg')} />
            </div>
            Добавить в избранное
          </div>*/}
          <div className="Settings__row" onClick={() => connect.send('VKWebAppShare', {})}>
            <div className="Settings__row__icon">
              <SVG src={require('../../asset/share_24.svg')} />
            </div>
            Поделиться с друзьями
          </div>
          <a href="https://vk.me/rouletteapp" target="_blank" className="Settings__row">
            <div className="Settings__row__icon">
              <SVG src={require('../../asset/message_24.svg')} />
            </div>
            Сообщить о проблеме
          </a>
          <a href="https://vk.com/rouletteapp" target="_blank" className="Settings__row">
            <div className="Settings__row__icon">
              <SVG src={require('../../asset/community_24.svg')} />
            </div>
            Сообщество приложения
          </a>
        </div>
      </div>
    )
  }
}
