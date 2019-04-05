import React, { Component } from 'react';
import './Settings.css';

export default class Settings extends Component {
  render() {
    return (
      <div className="Page__wrap">
        <div className="Settings__rows" onClick={this.props.showFilters}>
          <div className="Settings__row">
            <div className="Settings__row__icon">
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 15a1 1 0 1 1 0 2v-2zM4 17a1 1 0 1 1 0-2v2zm11-3a1 1 0 1 1 2 0h-2zm2 4a1 1 0 1 1-2 0h2zm3-1h-4v-2h4v2zm-7 0H4v-2h9v2zm2-1v-2h2v2h-2zm2 0v2h-2v-2h2zM4 7a1 1 0 0 0 0 2V7zm16 2a1 1 0 1 0 0-2v2zM9 6a1 1 0 0 0-2 0h2zm-2 4a1 1 0 1 0 2 0H7zM4 9h4V7H4v2zm7 0h9V7h-9v2zM9 8V6H7v2h2zM7 8v2h2V8H7z" fill="currentColor"/></svg>
            </div>
            Фильтр собеседников
          </div>
          <a href="https://vk.me/rouletteapp" target="_blank" className="Settings__row">
            <div className="Settings__row__icon">
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 12l.263.965a1 1 0 0 0 0-1.93L11 12zm-4.873 8.772l-.484-.875.484.875zm13.497-10.085l-.483.875.483-.875zm0 2.626l-.483-.875.483.875zM6.127 3.228l-.484.875.484-.875zm-.484.875l13.498 7.46.967-1.751-13.497-7.46-.968 1.751zm13.498 8.335L5.643 19.897l.968 1.75 13.497-7.459-.967-1.75zM4.92 19.325l.935-3.367-1.927-.535-.935 3.367 1.927.535zm3.036-5.458l3.307-.902-.526-1.93-3.307.902.526 1.93zm3.307-2.832l-3.307-.902-.526 1.93 3.307.902.526-1.93zM5.855 8.042L4.92 4.675l-1.927.535.935 3.367 1.927-.535zm0 7.916a3 3 0 0 1 2.101-2.091l-.526-1.93a5 5 0 0 0-3.502 3.486l1.927.535zm-.212 3.939a.5.5 0 0 1-.723-.572l-1.927-.535C2.4 20.925 4.67 22.719 6.61 21.647l-.968-1.75zm13.498-8.335a.5.5 0 0 1 0 .876l.967 1.75c1.721-.951 1.721-3.425 0-4.376l-.967 1.75zM7.956 10.133a3 3 0 0 1-2.1-2.091l-1.928.535a5 5 0 0 0 3.502 3.486l.526-1.93zm-1.345-7.78C4.67 1.28 2.4 3.075 2.993 5.21l1.927-.535a.5.5 0 0 1 .723-.572l.968-1.75z" fill="currentColor"/></svg>
            </div>
            Сообщить о проблеме
          </a>
          <a href="https://vk.com/rouletteapp" target="_blank" className="Settings__row">
            <div className="Settings__row__icon">
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.707 4.293a1 1 0 0 0-1.414 1.414l1.414-1.414zm.586 3.414a1 1 0 0 0 1.414-1.414L6.293 7.707zM5 13a1 1 0 1 0 0-2v2zm-3-2a1 1 0 1 0 0 2v-2zm2.293 7.293a1 1 0 1 0 1.414 1.414l-1.414-1.414zm3.414-.586a1 1 0 1 0-1.414-1.414l1.414 1.414zM13 19a1 1 0 1 0-2 0h2zm-2 3a1 1 0 1 0 2 0h-2zm7.293-2.293a1 1 0 0 0 1.414-1.414l-1.414 1.414zm-.586-3.414a1 1 0 0 0-1.414 1.414l1.414-1.414zM22 13a1 1 0 1 0 0-2v2zm-3-2a1 1 0 1 0 0 2v-2zm.707-5.293a1 1 0 0 0-1.414-1.414l1.414 1.414zm-3.414.586a1 1 0 0 0 1.414 1.414l-1.414-1.414zM13 2a1 1 0 1 0-2 0h2zm-2 3a1 1 0 1 0 2 0h-2zm1 15a8 8 0 0 0 8-8h-2a6 6 0 0 1-6 6v2zm-8-8a8 8 0 0 0 8 8v-2a6 6 0 0 1-6-6H4zm8-8a8 8 0 0 0-8 8h2a6 6 0 0 1 6-6V4zm8 8a8 8 0 0 0-8-8v2a6 6 0 0 1 6 6h2zM4.293 5.707l2 2 1.414-1.414-2-2-1.414 1.414zM5 11H2v2h3v-2zm.707 8.707l2-2-1.414-1.414-2 2 1.414 1.414zM11 19v3h2v-3h-2zm8.707-.707l-2-2-1.414 1.414 2 2 1.414-1.414zM22 11h-3v2h3v-2zm-3.707-6.707l-2 2 1.414 1.414 2-2-1.414-1.414zM11 2v3h2V2h-2z" fill="currentColor"/></svg>
            </div>
            Сообщество приложения
          </a>
        </div>
      </div>
    )
  }
}
