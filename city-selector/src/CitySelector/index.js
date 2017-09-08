'use strict';

require('./style.less');

export default class CitySelector {
    constructor(obj) {
        this.container = document.getElementById(obj.elementId);
        this._regionsUrl = obj.regionsUrl;
        this._localitiesUrl = obj.localitiesUrl;
        this._saveUrl = obj.saveUrl;

        this.container.addEventListener('click', this.showElements());
        this.container.addEventListener('click', this.getRegionsList());
    }


    showElements() {
        console.log('showElements');
        let chooseRegion = document.createElement('button');

        chooseRegion.innerHTML = 'Выбрать регион';
        chooseRegion.setAttribute('id', 'chooseRegion');
        chooseRegion.setAttribute('class', 'js-choose-region');

        const createCitySelector = document.getElementById('createCitySelector'),
            infoBlock = document.getElementById('info');

        createCitySelector.addEventListener('click', () => {
            infoBlock.style.display = 'block';
            document.body.insertBefore(chooseRegion, this.container);
        });
    }

    getRegionsList() {
        const url = this._regionsUrl;
        console.log('getRegionsList');
        document.body.addEventListener('click', (event) => {

            var clickedEl = event.target;

            if (clickedEl.className.indexOf('js-choose-region') === -1) {
                return;
            } else {
                this._sendRequest(url);
            }
        });
    }

    _sendRequest(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();
        if (xhr.status !== 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            const parsed = JSON.parse(xhr.response);

            let regionList = document.createElement('ul'),
                listItem;

            parsed.forEach((item) => {
                listItem  = document.createElement('li');
                listItem.className = 'js-regions-list-item';
                listItem.innerText = item.title;
                regionList.appendChild(listItem);
            });

            document.body.insertBefore(regionList, this.container);
        }
    }
}


//https://googlechrome.github.io/samples/classes-es6/
