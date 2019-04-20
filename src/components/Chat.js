import React, { Component } from 'react';
import './Chat.css';
import * as utils from '../utils';
import * as api from "../services/api";
import SVG from 'react-inlinesvg';
import emitter from "../services/emitter";

export default class Chat extends Component {
  constructor() {
    super();

    this.state = {
      text: '',
      photoShown: false,
      isFocused: false,
      sendButtonLocked: false,
      typingShown: false,
      isSkipLocked: true
    };
  }

  componentDidMount() {
    this.refs['peer_info'].scrollLeft = this.refs['peer_info'].scrollWidth;

    this.unlockSkipTimer = setTimeout(() => {
      this.setState({isSkipLocked: false});
    }, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.unlockSkipTimer);
    clearTimeout(this.unlockSendTimer);
  }

  render() {
    const photosLen = this.props.state.user.photos.length;
    const photosClassName = utils.classNames({
      Chat__photos: true,
      [photosLen > 2 ? `Chat__photos_many` : 'Chat__photos_two']: photosLen > 1
    });

    const sendBtnClassName = utils.classNames({
      ['Chat__send-from__send-button']: true,
      active: this.state.text.trim().length > 0 && !this.state.sendButtonLocked
    });

    const wrapClassName = utils.classNames({
      Chat__wrap: true,
      focused: this.state.isFocused
    });

    const skipBtnClassNames = utils.classNames({
      'Chat__send-from__skip_button': true,
      locked: this.state.isSkipLocked
    });

    return (
      <div className={wrapClassName}>
        {this._renderShownPhoto()}
        <div className="Chat__history-wrap">
          <div className="Chat__history">
            <div className="Chat__peer_info__wrap">
              <div className="Chat__peer_info" ref="peer_info">
                {this.props.state.user.photos.length > 0 && <div className={photosClassName}>
                  {this._renderPhotos()}
                </div>}
                <div className="Chat__peer_info_cont" style={{width: `${Math.min(560, window.innerWidth) - 152}px`}}>
                  <div className="Chat__name">{this.props.state.user.name}</div>
                  <div className="Chat__caption">{this._makeDescription()}</div>
                  {this.props.state.user.isVip && <div className="Chat__vip" onClick={this._vipDidPress}>
                    <SVG src={require('../asset/vip_badge.svg')} />
                  </div>}
                </div>
              </div>
            </div>
            <div className="Chat_messages">
              {this._renderMessages()}
              {this.state.typingShown && <div className="Chat__message inbox typing">
                <div className="Chat__message__text">
                  <div className="pr " id="">
                    <div className="pr_bt" />
                    <div className="pr_bt" />
                    <div className="pr_bt" />
                  </div>
                </div>
              </div>}
            </div>
          </div>
        </div>
        <div className="Chat__send-from">
          <div className="Chat__send-from__cont">
            {this._renderSuggestions()}
            <div className={skipBtnClassNames} onClick={this.props.skip}>
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.755 17A8 8 0 0 0 20 12v-1.5m-2.19-4A8 8 0 0 0 4 12v1.5m0 0L6.5 11M4 13.5L1.5 11m18.5-.5l2.5 2.5M20 10.5L17.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="Chat__send-from__input_wrap">
              <input
                type="text"
                maxLength={300}
                placeholder="Сообщение"
                className="Chat__send-from__input"
                value={this.state.text}
                onChange={(e) => {
                  this.setState({text: e.target.value});
                  this._typing();
                }}
                onKeyDown={this._formKeyDown}
                onFocus={() => this.setState({isFocused: true})}
                onBlur={() => {
                  this.setState({isFocused: false});
                  //Chat.scrollToBottom();
                }}
              />
            </div>
            <div
              className={sendBtnClassName}
              onMouseDown={(e) => {
                e.preventDefault();
                this._sendBtnDidPress();
              }}
            >
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 12l.263.965a1 1 0 0 0 0-1.93L11 12zm-4.873 8.772l-.484-.875.484.875zm13.497-10.085l-.483.875.483-.875zm0 2.626l-.483-.875.483.875zM6.127 3.228l-.484.875.484-.875zm-.484.875l13.498 7.46.967-1.751-13.497-7.46-.968 1.751zm13.498 8.335L5.643 19.897l.968 1.75 13.497-7.459-.967-1.75zM4.92 19.325l.935-3.367-1.927-.535-.935 3.367 1.927.535zm3.036-5.458l3.307-.902-.526-1.93-3.307.902.526 1.93zm3.307-2.832l-3.307-.902-.526 1.93 3.307.902.526-1.93zM5.855 8.042L4.92 4.675l-1.927.535.935 3.367 1.927-.535zm0 7.916a3 3 0 0 1 2.101-2.091l-.526-1.93a5 5 0 0 0-3.502 3.486l1.927.535zm-.212 3.939a.5.5 0 0 1-.723-.572l-1.927-.535C2.4 20.925 4.67 22.719 6.61 21.647l-.968-1.75zm13.498-8.335a.5.5 0 0 1 0 .876l.967 1.75c1.721-.951 1.721-3.425 0-4.376l-.967 1.75zM7.956 10.133a3 3 0 0 1-2.1-2.091l-1.928.535a5 5 0 0 0 3.502 3.486l.526-1.93zm-1.345-7.78C4.67 1.28 2.4 3.075 2.993 5.21l1.927-.535a.5.5 0 0 1 .723-.572l.968-1.75z" fill="currentColor"/></svg>
            </div>
          </div>
        </div>
      </div>
    )
  }

  static get skipIcon() {
    return <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M3.728 9.118a6.335 6.335 0 0 1 11.49-2.707c-.18.064-.35.168-.494.313l-.54.539A5.002 5.002 0 0 0 5.11 8.946l.419-.417a.667.667 0 0 1 .942.942l-1.666 1.667a.667.667 0 0 1-.943 0L2.195 9.471a.667.667 0 0 1 .943-.942l.59.59zm12.579 1.465a6.334 6.334 0 0 1-11.71 2.724c.25-.05.486-.171.68-.364l.41-.411a5.001 5.001 0 0 0 9.27-1.88l-.486.486a.667.667 0 0 1-.942-.943l1.666-1.666c.26-.26.683-.26.943 0l1.667 1.666a.667.667 0 0 1-.943.943l-.555-.555z" fill="#000" fillRule="nonzero"/></svg>;
  }

  _renderPhotos() {
    return this.props.state.user.photos.map((photo, i) => {
      return (
        <div
          key={i}
          className="Chat__photo"
          style={{backgroundImage: `url(${photo})`}}
          onClick={() => this._showPhoto(photo)}
        />
      )
    });
  }

  _renderMessages() {
    return this.props.state.messages.map((message, i) => {
      const className = utils.classNames({
        Chat__message: true,
        inbox: message.isInbox,
        outbox: !message.isInbox
      });
      return (
        <div
          key={i}
          className={className}
        >
          <div className="Chat__message__text">{message.text}</div>
        </div>
      )
    });
  }

  _sendBtnDidPress = () => {
    if (this.sending || this.state.sendButtonLocked) {
      return;
    }
    const text = this.state.text.trim();
    if (!text) {
      return;
    }

    this._sendMsg(text);
  };

  _sendMsg = (text) => {
    if (this.sending) {
      return;
    }
    this.sending = true;

    this.props.sendMessage(text).then(() => {
      this.setState({text: ''});
      Chat.scrollToBottom(true);
      this.sending = false;
      this.setState({sendButtonLocked: true});
      this.unlockSendTimer = setTimeout(() => this.setState({sendButtonLocked: false}), 1000);
      this.lastTyping = 0;
    }).catch(() => {
      this.sending = false;
    });
  };

  _makeDescription() {
    const user = this.props.state.user;

    let res = [];
    const bdExp = String(user.bdate).split('.');
    if (bdExp.length === 3) {
      res.push(utils.getUsrAge(new Date(parseInt(bdExp[2], 10), parseInt(bdExp[1], 10) - 1, parseInt(bdExp[0], 10)) / 1000) + ' лет');
    }

    if (user.city) {
      res.push(user.city);
    }

    if (user.education) {
      res.push(user.education);
    }

    return res.join(' · ');
  }

  _renderShownPhoto() {
    if (!this.state.photoShown) {
      return null;
    }

    return (
      <div
        className="Chat__photo-view" onClick={() => this.setState({photoShown: false})}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.setState({photoShown: false});
          return false;
        }}
      >
        <div className="Chat__photo__close" />
        <div className="Chat__photo-view-img" style={{backgroundImage: `url(${this.state.photoShown})`}} />
      </div>
    )
  }

  _showPhoto(src) {
    this.setState({photoShown: src});
  }

  static scrollToBottom(fast) {
    /*const el = document.querySelector('.Chat__history');
    if (!el) {
      return;
    }*/
    //const fn = () => el.scrollTop = el.scrollHeight;

    const fn = () => {
      const st = document.body.scrollHeight - window.scrollY - document.body.offsetHeight;
      if (st < 150) {
        if (fast) {
          window.scrollTo(0, document.body.scrollHeight);
        } else {
          utils.scrollToY(document.body.scrollHeight, 300);
        }
      }
    };
    if (fast) {
      fn();
    } else {
      setTimeout(fn);
    }
  }

  _formKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this._sendBtnDidPress();
    }
  };

  showTyping = () => {
    clearTimeout(this.typingTimer);
    this.setState({typingShown: true});
    Chat.scrollToBottom();

    this.typingTimer = setTimeout(this.hideTyping, 5000);
  };

  hideTyping = () => {
    clearTimeout(this.typingTimer);
    this.setState({typingShown: false});
  };

  _typing = () => {
    const now = new Date().getTime();
    if (now - this.lastTyping < 4000) {
      return;
    }
    this.lastTyping = now;
    api.method(api.methods.typing, {
      id: this.props.state.user.id
    });
  };

  _renderSuggestions = () => {
    if (this.props.state.messages.length > 0) {
      return null;
    }

    const messages = [
      'Стой!',
      'Привет!',
      'Как дела?',
      'Отличное фото'
    ].map((message, i) => <div className="Chat_suggestions__message" key={i} onClick={() => this._sendMsg(message)}>{message}</div>);

    return (
      <div className="Chat_suggestions">
        <div className="Chat_suggestions__info">
          <div className="Chat_suggestions__info_cont">
            <div className="Chat_suggestions__info__title">Скорее начни общение!</div>
            <div className="Chat_suggestions__info__caption">Или пропусти собеседника <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.836 11.333A5.333 5.333 0 0 0 13.333 8V7m-1.46-2.667A5.333 5.333 0 0 0 2.667 8v1m0 0l1.666-1.667M2.667 9L1 7.333M13.333 7L15 8.667M13.333 7l-1.666 1.667" stroke="#8994A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          </div>
          <div className="Chat_suggestions__info_icon" />
        </div>
        <div className="Chat_suggestions__messages_wrap">
          <div className="Chat_suggestions__messages">
            {messages}
          </div>
        </div>
      </div>
    )
  };

  _vipDidPress = () => {
    if (this.props.state.hasPremium) {
      return;
    }

    emitter.emit('togglePremiumBox', true);
  };
}
