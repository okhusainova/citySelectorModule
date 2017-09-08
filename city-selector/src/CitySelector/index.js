'use strict';

require('./style.less');
const $ = require('jQuery');

export default class CitySelector {
    constructor(obj) {
        this.container = document.getElementById(obj.elementId);
        this._regionsUrl = obj.regionsUrl;
        this._localitiesUrl = obj.localitiesUrl;
        this._saveUrl = obj.saveUrl;

        this.container.addEventListener('click', this.showElements());
        // $(`#${obj.elementId}`).on('click', '#chooseRegion', this.getRegionsList.bind(this));
        //https://blog.garstasio.com/you-dont-need-jquery/events/
    }


    showElements() {
        let chooseRegion = document.createElement('button');

        chooseRegion.innerHTML = 'Выбрать регион';
        chooseRegion.setAttribute('id', 'chooseRegion');

        const createCitySelector = document.getElementById('createCitySelector'),
              infoBlock = document.getElementById('info');

        createCitySelector.addEventListener('click', () => {
            infoBlock.style.display = 'block';
            document.body.insertBefore(chooseRegion, this.container);
        });
    }

    getRegionsList() {
        const url = this._regionsUrl;
            this._sendRequest(url);
    }

    _sendRequest(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();
        if (xhr.status != 200) {
            console.log( xhr.status + ': ' + xhr.statusText );
        } else {
            console.log(xhr);
        }
    }
}


//https://googlechrome.github.io/samples/classes-es6/
