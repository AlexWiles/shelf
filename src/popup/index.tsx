import "./Popup.scss";
import "antd/dist/antd.css";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Screen from '../components/Screen';

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    ReactDOM.render(<Screen />, document.getElementById('popup'));
});
