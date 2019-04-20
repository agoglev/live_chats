import React, { Component } from 'react';
import './Filters.css';
import * as utils from '../../utils';
import * as UI from '@vkontakte/vkui';
import emitter from '../../services/emitter';

export default class Filters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gender: props.filters.gender,
      ageFrom: props.filters.ageFrom || 14,
      ageTo: props.filters.ageTo || 80,
      isSuccessShown: false
    };
  }

  render() {
    return (
      <div className="Page__wrap">
        {this._renderSuccess()}
        <div className="Filters__wrap">
          <div className="Filters__section">
            <div className="Filters__section__title">Пол</div>
            <div className="Filters__gender__items">
              {this._renderGenders()}
            </div>
          </div>
          <div className="Filters__section">
            <div className="Filters__section__title">
              Возраст
              <div className="Filters__section__title__info">От {this.state.ageFrom} до {this.state.ageTo}</div>
            </div>
            <UI.RangeSlider
              top="Uncontrolled"
              min={14}
              max={80}
              step={1}
              onChange={this._ageDidChange}
              defaultValue={[this.state.ageFrom, this.state.ageTo]}
            />
          </div>
          <div className="Filters__button_wrap">
            <div className="Status__into__button" onClick={this._save}>{this.props.hasPremium ? 'Найти собеседника' : 'Получить VIP и применить'}</div>
          </div>
        </div>
      </div>
    )
  }

  _renderSuccess = () => {
    if (!this.state.isSuccessShown) {
      return null;
    }

    return (
      <div className="Filters__success">
        <div className="Filters__success_cont">
          <div className="Filters__success_close" onClick={() => this.setState({isSuccessShown: false})}>
            <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="12" fill="#F0F2F5"/><path d="M20 20l8 8M28 20l-8 8" stroke="#B2B9C2" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div className="Filters__success_icon">
            <svg width="72" height="72" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="36" cy="36" r="35" stroke="#52CCAD" strokeWidth="2"/><path d="M18 38l10 10 24-24" stroke="#52CCAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="Filters__success_title">Красава! Теперь у тебя целый месяц будет фильтр. Поищем незнакомцев?</div>
          <div className="Filters__success_button_wrap">
            <div className="Status__into__button" onClick={this._save}>Начать</div>
          </div>
        </div>
      </div>
    )
  };

  _renderGenders = () => {
    return [{
      type: 'all',
      title: 'Любой',
    }, {
      type: 'male',
      title: 'Муж.',
    }, {
      type: 'female',
      title: 'Жен.',
    }].map((item, i) => {
      const className = utils.classNames({
        Filters__gender__item: true,
        selected: this.state.gender === item.type
      });
      return (
        <div className={className} key={i} onClick={() => this.setState({gender: item.type})}>
          <div className={`Filters__gender__item_icon ${item.type}`} />
          <div className="Filters__gender__item_name">{item.title}</div>
        </div>
      )
    });
  };

  _save = () => {
    if (this.props.hasPremium) {
      this.props.applyFilters({...this.state});
    } else {
      emitter.emit('togglePremiumBox', true);
    }
  };

  _ageDidChange = ([ageFrom, ageTo]) => {
    this.setState({ageFrom, ageTo});
  };
}
