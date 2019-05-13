import { ezConfigMock } from './jest.window.mock';
import $ from 'jquery';

global.$ = $;
global.jQuery = $;
global.$.fn.modal = jest.fn();
global.eZ = {
    ...ezConfigMock,
    addConfig: jest.fn(),
};

global.Translator = {
    trans: jest.fn(),
};
