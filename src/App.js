import React, { Component } from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import './style.css';
import * as api from './services/api';
import { setEventHandler } from './realtime';
import * as payment from './payments';
import Chat from './components/Chat';
import Rates from './components/Rates';
import Settings from './components/Settings/Settings';
import Filters from './components/Filters/Filters';
import PremiumBox from './components/PremiumBox/PremiumBox';
import * as utils from './utils';
import connect from '@vkontakte/vkui-connect';
import emitter from './services/emitter';

const Status = {
  nothing: 0,
  loading: 1,
  connecting: 2,
  chat: 3,
  leave: 4,
  error: 5,
  payment: 6,
  settings: 7,
  filters: 8,
};

let SkipChatUser = {};

class App extends Component {
  constructor() {
    super();

    this.connectingChatId = null;

    this.state = {
      loadingPayments: false,
      loadingPaymentsFailed: false,
      availChats: 0,
      status: Status.nothing,
      messages: [],
      isMultiConnections: false,
      buttonType: '',
      onlineCount: 0,
      hasPremium: utils.isIOS(),
      filters: {
        gender: 'all',
        ageFrom: 14,
        ageTo: 80
      },
      isPremiumBoxShown: false,
      vkInfo: window.VkInfo,
      /*user: {
        name: 'Test',
        bdate: '31.01.1995',
        city: 'Moscow',
        isVip: true,
        photos: [
          'https://sun1-23.userapi.com/c855224/v855224035/166b7/v1gBZcv3o9Y.jpg',
          'https://pp.userapi.com/c851420/v851420808/ed655/btjtdLMkbBM.jpg'
        ]
      }*/
    };
  }

  componentDidMount() {
    setEventHandler(this._eventDidReceive);
    this._loadPayments();

    this.listeners = [];
    this.listeners.push(emitter.addListener('togglePremiumBox', (shown = false) => this.setState({isPremiumBoxShown: shown})));
    this.listeners.push(emitter.addListener('vkInfoUpdated', (vkInfo) => this.setState({vkInfo})));
  }

  componentWillUnmount() {
    for (let listener of this.listeners) {
      listener.remove();
    }
    this.listeners = [];
  }

  render() {
    const classNames = utils.classNames({
      App: true,
      android: utils.isAndroid()
    });
    return (
      <div className={classNames}>
        <div className="App__header">
          <div className="App__header__content">
            {this._renderHeaderButton()}
            <div className="App__header__logo">{this._getTitle()}</div>
            {false && window.VkInfo.sex === 2 && !this.state.loadingPayments && <div className="App__header__balance">{utils.availChatsStr(this.state.availChats)}</div>}
          </div>
        </div>
        {this._renderGetContent()}
        {this._renderPremium()}
      </div>
    );
  }

  _renderGetContent() {
    if (this.state.isMultiConnections) {
      //return this._renderStatusLoading();
    }

    switch (this.state.status) {
      case Status.nothing:
        return this._renderStatusNothing();
      case Status.loading:
      case Status.connecting:
      case Status.leave:
      case Status.error:
        return this._renderStatusLoading();
      case Status.chat:
        return <Chat
          ref="chat"
          state={this.state}
          skip={() => this._leaveChat()}
          sendMessage={this._sendMessage}
        />;
      case Status.payment:
        return <Rates state={this.state} showOrder={this._showOrder} />;
      case Status.settings:
        return <Settings showFilters={this.showFilters} />;
      case Status.filters:
        return <Filters {...this.state} applyFilters={this.applyFilters} setHashPremium={this.setHashPremium} />;
    }
  }

  _renderStatusNothing() {
    const buttonClassName = utils.classNames({
      Status__into__button: true,
      loading: this.state.loadingPayments,
      failed: this.state.loadingPaymentsFailed
    });

    let buttonText = 'Начать';
    if (this.state.loadingPayments) {
      buttonText = 'Загрузка…';
    }

    if (this.state.loadingPaymentsFailed) {
      buttonText = 'Ошибка';
    }

    const onlineCount = utils.gram(this.state.onlineCount, ['незнакомец', 'незнакомца', 'незнакомцев']);
    const wantGram = utils.gram(this.state.onlineCount, ['хочет', 'хотят', 'хотят'], true);

    return (
      <div className="Status__wrap">
        <div className="Status__into">
          <div className="Status__into__icon" />
          <div className="Status__into__caption"><span>{onlineCount}</span> онлайн и {wantGram} пообщаться с тобой. Сыграй в рулетку и зарядись позитивом!</div>
          <div className={buttonClassName} onClick={this._start}>{buttonText}</div>
          <div className="Intro__filters" onClick={this.showFilters}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 15C20.5523 15 21 15.4477 21 16C21 16.5523 20.5523 17 20 17V15ZM4 17C3.44772 17 3 16.5523 3 16C3 15.4477 3.44772 15 4 15V17ZM15 14C15 13.4477 15.4477 13 16 13C16.5523 13 17 13.4477 17 14H15ZM17 18C17 18.5523 16.5523 19 16 19C15.4477 19 15 18.5523 15 18H17ZM20 17H16V15H20V17ZM13 17H4V15H13V17ZM15 16V14H17V16H15ZM17 16V18H15V16H17Z" fill="currentColor"/>
              <path d="M4 7C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9V7ZM20 9C20.5523 9 21 8.55228 21 8C21 7.44772 20.5523 7 20 7V9ZM9 6C9 5.44772 8.55228 5 8 5C7.44772 5 7 5.44772 7 6H9ZM7 10C7 10.5523 7.44772 11 8 11C8.55228 11 9 10.5523 9 10H7ZM4 9H8V7H4V9ZM11 9H20V7H11V9ZM9 8V6H7V8H9ZM7 8V10H9V8H7Z" fill="currentColor"/>
            </svg>
            Фильтр
          </div>
        </div>
      </div>
    )
  }

  _renderStatusLoading() {
    let title = 'Ищем свободного собеседника…';
    let className = '';

    if (this.state.isMultiConnections) {
      title = 'Похоже, у тебя рулетка запущена ещё с одного устройства или браузера. Оставь одну!';
      className = 'multi_connect';
    //} else if (this.state.status === Status.connecting) {
    //  title= 'Соединение';
    } else if (this.state.status === Status.leave) {
      title= <span>Собеседник слился :(<br />Ищем другого…</span>;
      className = 'leave';
    } else if (this.state.status === Status.error) {
      title=  'Что-то пошло не так';
    }

    return (
      <div className="Status__wrap">
        <div className={`Status__loading ${className}`}>
          <div className="Status__loading__icon">
            <div className="Status__loading__indicator">
              <svg width="104" height="104" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0a52 52 0 0 1 52 52h-2.002A49.997 49.997 0 0 0 0 2.002V0z" fill="currentColor"/><defs><linearGradient id="paint0_linear" x1="-52" y1="104" x2="52" gradientUnits="userSpaceOnUse"><stop/><stop offset="1"/><stop offset="1"/></linearGradient></defs></svg>
            </div>
          </div>
          <div className="Status__loading__title">{title}</div>
        </div>
      </div>
    )
  }

  _start = () => {
    utils.statReachGoal('start');

    if (this.state.loadingPaymentsFailed) {
      //return this._loadPayments();
    }

    if (window.VkInfo.sex === 2 && !this.state.availChats) {
      //return this.setState({status: Status.payment});
    }

    this.setState({status: Status.loading});
    api.vk('photos.get', {
      album_id: 'profile',
      rev: 1,
      count: 5,
      photo_sizes: 1
    }).then((resp) => {
      let photos = [];
      for (let i = 0; i < resp.items.length; i++) {
        const item = resp.items[i];
        let src = false;
        let lastSize = 0;
        for (let j = 0; j < item.sizes.length; j++) {
          const size = item.sizes[j];
          if (size.width > lastSize) {
            src = size.url;
            lastSize = size.width;
          }
          if (lastSize >= 600) {
            break;
          }
          if (['x', 'y'].indexOf(size.type) > -1) {
            src = size.url;
            break;
          }
        }
        if (!src) {
          continue;
        }
        photos.unshift(src);
      }

      window.VkInfo.photos = photos;

      if (this.state.status !== Status.loading) {
        return;
      }

      if (!window.isNotificationsEnabled) {
        connect.send('VKWebAppAllowNotifications', {});
        window.isNotificationsEnabled = true;
      }
      this._checkChats();
    }).catch(() => {
      if (!this.state.status !== Status.loading) {
        return;
      }

      window.VkInfo.photos = [];
      this._checkChats();
    });
  };

  _stopCheck = () => {
    this.connectingChatId = null;
    clearTimeout(this.checkChatsTimer);
    clearTimeout(this.useTimer);
  };

  _checkChats = (status = Status.loading) => {
    this._stopCheck();

    if (window.VkInfo.sex === 2 && !this.state.availChats) {
      //return this.setState({status: Status.payment});
    }

    this.setState({status});
    const info = window.VkInfo;

    let age = 0;
    const bdExp = String(info.bdate).split('.');
    if (bdExp.length === 3) {
      age = utils.getUsrAge(new Date(parseInt(bdExp[2], 10), parseInt(bdExp[1], 10) - 1, parseInt(bdExp[0], 10)) / 1000);
    }

    api.method(api.methods.check, {
      name: info.first_name,
      photos: info.photos.length > 0 ? info.photos : [info.photo_400_orig],
      gender: info.sex,
      bdate: info.bdate,
      education: info.university_name,
      city: info.city ? info.city.title : '',
      group_id: window.GroupId,
      age,
      filter_gender: this.state.filters.gender === 'all' ? 0 : (this.state.filters.gender === 'male' ? 2 : 1),
      filter_age_from: this.state.filters.ageFrom,
      filter_age_to: this.state.filters.ageTo
    }).then((resp) => {
      clearTimeout(this.checkChatsTimer);
      if (this.state.status !== status) {
        return;
      }
      if (resp.chat) {
        this.connectingChatId = resp.chat;
        this.setState({status: Status.connecting});
        this.checkChatsTimer = setTimeout(this._checkChats, 7000);
      } else {
        this.checkChatsTimer = setTimeout(this._checkChats, 2000);
      }
    }).catch(() => {
      this.checkChatsTimer = setTimeout(this._checkChats, 3000);
    });
  };

  _eventDidReceive = (event) => {
    console.log('event', event);
    switch (event.type) {
      case 'check':
        this._checkEventDidReceive(parseInt(event.fromId, 10));
        break;
      case 'connect':
        this._connectEventDidReceive(parseInt(event.fromId, 10), event.user, parseInt(event.force, 10) === 1);
        break;
      case 'reject':
        this._rejectEventDidReceive(parseInt(event.fromId, 10));
        break;
      case 'leave':
        this._leaveEventDidReceive(parseInt(event.fromId, 10));
        break;
      case 'message':
        this._messageEventDidReceive(parseInt(event.fromId, 10), event.text);
        break;
      case 'multi_connections':
        this._multiConnectionsEventDidReceive();
        break;
      case 'online':
        this.setState({onlineCount: parseInt(event.count, 10)});
        break;
      case 'typing':
        this._typingEventDidReceive(parseInt(event.fromId, 10));
        break;
      case 'filters':
        this.setState({filters: event.filters, hasPremium: event.hasPremium || utils.isIOS()});
        break;
    }
  };

  _typingEventDidReceive = (fromId) => {
    if (this.connectingChatId === fromId) {
      this.refs.chat && this.refs.chat.showTyping();
    }
  };

  _multiConnectionsEventDidReceive = () => {
    if (this.state.status !== Status.nothing) {
      this.connectingChatId = null;
      clearTimeout(this.checkChatsTimer);
      clearTimeout(this.useTimer);
      this.setState({status: Status.nothing});
    }
    this.setState({isMultiConnections: true});
  };

  _checkEventDidReceive(fromId) {
    if (this.state.status === Status.loading || this.state.status === Status.leave) {
      clearTimeout(this.checkChatsTimer);
      this.connectingChatId = fromId;
      this.setState({status: Status.connecting});
      api.method(api.methods.accept, {id: fromId});
      console.log('_checkEventDidReceive: send accept');
    } else {
      api.method(api.methods.reject, {id: fromId});
      console.log('_checkEventDidReceive: send reject');
    }
  }

  _connectEventDidReceive(fromId, user, force) {
    if (this.state.status === Status.connecting && (force || this.connectingChatId === fromId)) {
      this.setState({status: Status.chat, user, messages: []});
      clearTimeout(this.checkChatsTimer);
      if (!force) {
        this.useTimer = setTimeout(() => this._useChat(fromId), 5000);
      }
      utils.statReachGoal('connect');
    } else {
      console.log('_connectEventDidReceive: send leave');
      api.method(api.methods.leave, { id: fromId });
    }
  }

  _rejectEventDidReceive(fromId) {
    if (this.state.status === Status.connecting && this.connectingChatId === fromId) {
      this._checkChats();
    }
  }

  _leaveEventDidReceive(fromId) {
    if (this.state.status === Status.chat && parseInt(this.state.user.id, 10) === fromId) {
      clearTimeout(this.checkChatsTimer);
      this.setState({status: Status.leave});
      this._checkChats(Status.leave);
      console.log('_leaveEventDidReceive');
    }
  }

  _messageEventDidReceive(fromId, text) {
    if (this.state.status === Status.chat && parseInt(this.state.user.id, 10) === fromId) {
      const messages = this.state.messages;
      messages.push({isInbox: true, text});
      this.setState({messages});
      Chat.scrollToBottom(true);
      this.refs.chat && this.refs.chat.hideTyping();
    } else {
      api.method(api.methods.leave, { id: fromId });
    }
  };

  _leaveChat = (skipSearch = false) => {
    api.method(api.methods.leave, { id: this.state.user.id });
    if (!skipSearch) {
      this._checkChats();
    }
    utils.statReachGoal('skip');
  };

  _loadPayments = () => {
    if (window.VkInfo.sex === 1 || true) {
      return this.setState({loadingPayments: false});
    }
    this.setState({loadingPaymentsFailed: false, loadingPayments: true});
    payment.getAvailableChats()
      .then((availChats) => this.setState({availChats, loadingPayments: false}))
      .catch(() => this.setState({loadingPaymentsFailed: true, loadingPayments: false}));
  };

  _useChat = (fromId) => {
    if (SkipChatUser[fromId] || true) {
      return;
    }
    SkipChatUser[fromId] = true;
    const availChats = this.state.availChats - 1;
    this.setState({availChats});
    payment.useChat();
  };

  _showOrder = (rate, count) => {
    if (!count) {
      return;
    }
    payment.showOrderBox(rate).then(() => {
      payment.incrChats(count);
      const availChats = this.state.availChats + count;
      this.setState({availChats});
      this._checkChats();
    }).catch((err) => {
      alert('Проишошла ошибка');
    });
  };

  _sendMessage = (text) => {
    return new Promise((resolve, reject) => {
      api.method(api.methods.message, {
        text,
        id: this.state.user.id
      }).then(() => {
        let messages = this.state.messages;
        messages.push({
          text,
          isInbox: false
        });
        this.setState({messages});
        resolve();
        utils.statReachGoal('message_sent');
      }).catch(() => {
        reject();
        utils.statReachGoal('message_failed');
      });
    });
  };

  _renderHeaderButton = () => {
    let icon;
    if (this.state.status === Status.nothing) {
      icon = (
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      )
    } else {
      icon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.5 18.5L5 12L11.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }

    return (
      <div className="App__header__btn" onClick={this._headBtnDidPress}>{icon}</div>
    )
  };

  _getTitle = () => {
    if (this.state.status === Status.leave || this.state.status === Status.loading || this.state.status === Status.connecting) {
      return 'Поиск';
    } else if (this.state.status === Status.chat) {
      return this.state.user.name;
    } else if (this.state.status === Status.settings) {
      return 'Настройки';
    } else if (this.state.status === Status.filters) {
      return 'Фильтры';
    }
    return 'Рулетка';
  };

  _headBtnDidPress = () => {
    if (this.state.status === Status.leave || this.state.status === Status.loading || this.state.status === Status.connecting || this.state.status === Status.chat) {
      this._stopCheck();
      if (this.state.status === Status.chat) {
        this._leaveChat(true);
      }
      this.setState({status: Status.nothing});
      this._updateOnline();
    } else if (this.state.status === Status.settings || this.state.status === Status.filters) {
      this.setState({status: Status.nothing});
      this._updateOnline();
    } else if (this.state.status === Status.nothing) {
      this._openSettings();
    }
  };

  _openSettings = () => {
    this.setState({status: Status.settings});
  };

  _updateOnline = () => {
    api.method(api.methods.updateOnline);
  };

  showFilters = () => {
    this.setState({status: Status.filters});
  };

  applyFilters = (filters) => {
    this.setState({filters});
    this._start();
  };

  setHashPremium = () => {
    this.setState({hasPremium: true});
  };

  _renderPremium() {
    if (!this.state.isPremiumBoxShown) {
      return null;
    }

    return <PremiumBox state={this.state} setHashPremium={this.setHashPremium} />;
  }
}

export default App;
