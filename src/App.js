import React, { Component } from 'react';
import './style.css';
import * as api from './services/api';
import { setEventHandler } from './realtime';
import * as payment from './payments';
import Chat from './components/Chat';
import Rates from './components/Rates';
import * as utils from './utils';

const Status = {
  nothing: 0,
  loading: 1,
  connecting: 2,
  chat: 3,
  leave: 4,
  error: 5,
  payment: 6
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
    };
  }

  componentDidMount() {
    setEventHandler(this._eventDidReceive);
    this._loadPayments();
  }

  render() {
    return (
      <div className="App">
        <div className="App__header">
          <div className="App__header__content">
            <div className="App__header__logo">Рулетка</div>
            {false && window.VkInfo.sex === 2 && !this.state.loadingPayments && <div className="App__header__balance">{utils.availChatsStr(this.state.availChats)}</div>}
          </div>
        </div>
        {this._renderGetContent()}
      </div>
    );
  }

  _renderGetContent() {
    if (this.state.isMultiConnections) {
      return this._renderStatusLoading();
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
          state={this.state}
          skip={this._leaveChat}
          sendMessage={this._sendMessage}
        />;
      case Status.payment:
        return <Rates state={this.state} showOrder={this._showOrder} />;
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

    return (
      <div className="Status__wrap">
        <div className="Status__into">
          <div className="Status__into__icon" />
          <div className="Status__into__title">Сыграй в рулетку!</div>
          <div className="Status__into__caption">Рулетка соединяет с незнакомцами в чате. Ты&nbsp;либо заводишь диалог, либо ищешь следующего. Общайся, находи интересных людей и заряжайся позитивом!</div>
          <div className={buttonClassName} onClick={this._start}>{buttonText}</div>
        </div>
      </div>
    )
  }

  _renderStatusLoading() {
    let className = '';
    let title = 'Поиск собеседника';
    let caption = 'Соединим с первым из очереди';
    let button = false;

    if (this.state.isMultiConnections) {
      title = 'Ошибка';
      caption = 'Вы уже используете Рулетку с другого устройства';
      className = 'leave';
      button = <div className="Status__button" onClick={() => window.location.reload()}>Обновить страницу</div>;
    } else if (this.state.status === Status.connecting) {
      title= 'Соединение';
      caption = 'Ждём подключения собеседника';
      className = 'connecting';
    } else if (this.state.status === Status.leave) {
      title= 'Собеседник покинул чат';
      caption = false;
      className = 'leave';
      button = <div className="Status__button" onClick={this._checkChats}>Найти нового</div>;
    } else if (this.state.status === Status.leave) {
      title= 'Что-то пошло не так';
      caption = false;
      className = 'leave';
      button = <div className="Status__button" onClick={this._checkChats}>Повторить</div>;
    }

    return (
      <div className="Status__wrap">
        <div className={`Status__loading ${className}`}>
          <div className="Status__loading__icon" />
          <div className="Status__loading__title">{title}</div>
          {caption && <div className="Status__loading__caption">{caption}</div>}
          {button}
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
        if (!src || isNaN(src) || src === null) {
          continue;
        }
        photos.push(src);
      }

      window.VkInfo.photos = photos;

      if (this.state.status !== Status.loading) {
        return;
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

  _checkChats = () => {
    this.connectingChatId = null;
    clearTimeout(this.checkChatsTimer);
    clearTimeout(this.useTimer);

    if (window.VkInfo.sex === 2 && !this.state.availChats) {
      //return this.setState({status: Status.payment});
    }

    this.setState({status: Status.loading});
    const info = window.VkInfo;
    api.method(api.methods.check, {
      name: info.first_name,
      photos: info.photos.length > 0 ? info.photos : [info.photo_400_orig],
      gender: info.sex,
      bdate: info.bdate,
      education: info.university_name,
      city: info.city ? info.city.title : ''
    }).then((resp) => {
      clearTimeout(this.checkChatsTimer);
      if (this.state.status !== Status.loading) {
        return;
      }
      if (resp.chat) {
        this.connectingChatId = resp.chat;
        this.setState({status: Status.connecting});
        this.checkChatsTimer = setTimeout(this._checkChats, 7000);
      } else {
        this.checkChatsTimer = setTimeout(this._checkChats, 4000);
      }
    }).catch(() => this.setState({status: Status.error}));
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
    if (this.state.status === Status.loading) {
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
      console.log('_leaveEventDidReceive');
    }
  }

  _messageEventDidReceive(fromId, text) {
    if (this.state.status === Status.chat && parseInt(this.state.user.id, 10) === fromId) {
      const messages = this.state.messages;
      messages.push({isInbox: true, text});
      this.setState({messages});
      Chat.scrollToBottom(true);
    } else {
      api.method(api.methods.leave, { id: fromId });
    }
  };

  _leaveChat = () => {
    api.method(api.methods.leave, { id: this.state.user.id });
    this._checkChats();
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
}

export default App;
