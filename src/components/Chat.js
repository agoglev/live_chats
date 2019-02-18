import React, { Component } from 'react';
import './Chat.css';
import * as utils from '../utils';

export default class Chat extends Component {
  constructor() {
    super();

    this.state = {
      text: '',
      photoShown: false,
      isFocused: false,
      sendButtonLocked: false
    };
  }

  componentWillUnmount() {
    clearTimeout(this.unlockSendTimer);s
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

    return (
      <div className={wrapClassName}>
        {this._renderShownPhoto()}
        <div className="Chat__history-wrap">
          <div className="Chat__history">
            <div>
              <div className="Chat__name">{this.props.state.user.name}</div>
              <div className="Chat__caption">{this._makeDescription()}</div>
            </div>
            <div className={photosClassName}>
              {this._renderPhotos()}
            </div>
            <div className="Chat_messages">
              <div className="Chat__message system">
                <div className="Chat__message__text">Напиши первое сообщение! Если {this.props.state.user.name} не нравится, нажми {Chat.skipIcon()} снизу и перейди к другому собеседнику.</div>
              </div>
              {this._renderMessages()}
            </div>
          </div>
        </div>
        <div className="Chat__send-from">
          <div className="Chat__send-from__cont">
            <div className="Chat__send-from__input_wrap">
              <input
                type="text"
                maxLength={300}
                placeholder="Ваше сообщение.."
                className="Chat__send-from__input"
                value={this.state.text}
                onChange={(e) => this.setState({text: e.target.value})}
                onKeyDown={this._formKeyDown}
                onFocus={() => this.setState({isFocused: true})}
                onBlur={() => {
                  this.setState({isFocused: false});
                  Chat.scrollToBottom();
                }}
              />
              <div
                className={sendBtnClassName}
                onMouseDown={(e) => {
                  e.preventDefault();
                  this._sendBtnDidPress();
                }}
              >
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M5.733 12a4.985 4.985 0 0 1-1.94-2.358C3.134 7.98 2.667 6.6 2.392 5.488c-.515-2.077-.577-2.579.15-3.559.665-.894 1.61-1.062 2.559-.843.455.105.942.307 1.58.63 1.87.944 10.107 5.615 12.504 7.07.925.56 1.22.747 1.561 1.006.781.592 1.256 1.204 1.255 2.21 0 1.004-.475 1.615-1.256 2.207-.341.259-.636.445-1.56 1.005-2.327 1.41-10.658 6.138-12.504 7.07-.638.323-1.125.525-1.58.63-.949.219-1.894.05-2.558-.843-.728-.98-.666-1.482-.151-3.559.275-1.112.742-2.491 1.403-4.154A4.985 4.985 0 0 1 5.733 12zm-.102 3.102c-.63 1.586-1.07 2.884-1.32 3.895-.495 1.999-.495 2.499 1.484 1.5 1.98-1 10.383-5.792 12.37-6.997 2.474-1.5 2.474-1.5 0-3-2.103-1.276-10.39-5.997-12.37-6.996-1.98-1-1.98-.5-1.484 1.5.25 1.01.69 2.308 1.32 3.894a2.975 2.975 0 0 0 2.305 1.847c3.52.546 5.281.964 5.281 1.255 0 .29-1.76.709-5.28 1.254a2.975 2.975 0 0 0-2.306 1.848z" fill="#9DA0A3" fillRule="nonzero"/></svg>
              </div>
            </div>
            <div className="Chat__send-from__skip_button" onClick={this.props.skip}>
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M2.591 10.177C3.235 5.557 7.202 2 12 2a9.49 9.49 0 0 1 7.828 4.116 1.992 1.992 0 0 0-.742.47l-.809.808A7.503 7.503 0 0 0 4.667 9.92l.626-.626a1 1 0 0 1 1.414 1.414l-2.5 2.5a1 1 0 0 1-1.414 0l-2.5-2.5a1 1 0 0 1 1.414-1.414l.884.884zm18.87 2.198C21.018 17.21 16.95 21 12 21a9.494 9.494 0 0 1-8.104-4.54 1.99 1.99 0 0 0 1.018-.546l.617-.617a7.501 7.501 0 0 0 13.906-2.82l-.73.73a1 1 0 0 1-1.414-1.414l2.5-2.5a1 1 0 0 1 1.414 0l2.5 2.5a1 1 0 0 1-1.414 1.414l-.833-.832z" fill="#9DA0A3" fillRule="nonzero"/></svg>
            </div>
          </div>
        </div>
      </div>
    )
  }

  static skipIcon() {
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
    this.sending = true;

    this.props.sendMessage(text).then(() => {
      this.setState({text: ''});
      Chat.scrollToBottom(true);
      this.sending = false;
      this.setState({sendButtonLocked: true});
      this.unlockSendTimer = setTimeout(() => this.setState({sendButtonLocked: false}), 1000);
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
      <div className="Chat__photo-view" onClick={() => this.setState({photoShown: false})}>
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
        window.scrollTo(0, document.body.scrollHeight);
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
}
