/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';

import * as th from './dglib/thread'

const os = createOs()

render(() => <App />, document.getElementById('root') as HTMLElement);
