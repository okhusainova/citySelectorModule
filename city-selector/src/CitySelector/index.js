'use strict';

require('./style.less');

export default class CitySelector {
    constructor(obj) {
        this.container = document.getElementById(obj.elementId);
        this._regionsUrl = obj.regionsUrl;
        this._localitiesUrl = obj.localitiesUrl;
        this._saveUrl = obj.saveUrl;

        this.container.addEventListener('click', this.showElements());
        if (document.getElementById('chooseRegion') === null) {
            this.container.addEventListener('click', this.getRegionsList());
        }
        document.getElementById('destroyCitySelector').addEventListener('click', () => {
            this.destroy()
        });
    }

    destroy() {
        this.container.innerHTML = '';
        document.getElementById('info').style.display = 'none';
    }

    showElements() {
        const createCitySelector = document.getElementById('createCitySelector'),
            infoBlock = document.getElementById('info');

        let chooseRegion = document.createElement('button');

        chooseRegion.innerHTML = 'Выбрать регион';
        chooseRegion.setAttribute('id', 'chooseRegion');
        chooseRegion.setAttribute('class', 'js-choose-region');
        chooseRegion.setAttribute('data-action', 'chooseRegion');

        createCitySelector.addEventListener('click', () => {
            infoBlock.style.display = 'block';
            this.container.appendChild(chooseRegion);
        });
    }

    getRegionsList() {
        this._delegation();
    }

    saveLocation() {
        this._delegation();
    }

    _delegation() {
        this.chooseRegion = () => {
            const url = this._regionsUrl;

            this._sendRequestRegions(url);
        };

        this.getLocalityList = (target) => {
            const clickedEl = target,
                _id = clickedEl.getAttribute('data-id'),
                url = this._localitiesUrl + '/' + _id;

            document.getElementById('regionText').innerHTML = _id;

            if (document.getElementById('saveLocation')) {
                document.getElementById('saveLocation').disabled = true;
            }

            this.detectClickedElement(clickedEl);
            this._sendRequestLocalities(url, _id);
        };

        this.chooseLocality = (target) => {
            const clickedEl = target,
                _id = clickedEl.getAttribute('data-id'),
                _name = clickedEl.innerText;

            let saveBtn = document.createElement('button');

            document.getElementById('localityText').innerHTML = _name;

            if (document.getElementById('saveLocation')) {
                document.getElementById('saveLocation').remove();
            }

            this.detectClickedElement(clickedEl);

            saveBtn.className = 'js-save-location';
            saveBtn.id = 'saveLocation';
            saveBtn.innerText = 'Сохранить';
            saveBtn.setAttribute('data-action', 'sendLocality');
            saveBtn.setAttribute('data-id', _id);
            saveBtn.setAttribute('data-name', _name);
            this.container.appendChild(saveBtn);

            //не придумала другого способа передать в sendLocality аргументы _id и _name, кроме как записать их дата-атрибутами в кнопку...
        };

        this.sendLocality = (target) => {
            const url = this._saveUrl,
                  id = target.getAttribute('data-id'),
                  name = target.getAttribute('data-name');

            this._sendRequestForSave(url, id, name);

        };

        const self = this;

        document.getElementById('citySelector').addEventListener('click', (e) => {
            const target = e.target,
                action = target.getAttribute('data-action');

            if (action) {
                self[action](target);
            }
        });
    }

    detectClickedElement(item) {
        const clickedElement = document.querySelectorAll("._clicked");

        [].forEach.call(clickedElement, function (el) {
            el.classList.remove("_clicked");
        });

        item.className += ' ' + '_clicked';
    }

    _sendRequestRegions(url) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, false);
        xhr.send();
        if (xhr.status !== 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            document.getElementById('chooseRegion').remove();

            if (document.getElementById('localitiesList')) {
                document.getElementById('localitiesList').remove();
            }

            const parsed = JSON.parse(xhr.response);

            let regionList = document.createElement('ul'),
                listItem;

            regionList.className = 'js-regions-list regions-list';
            regionList.id = 'regionsList';


            parsed.forEach((item) => {
                listItem = document.createElement('li');
                listItem.className = 'js-regions-list-item regions-list__item';
                listItem.innerText = item.title;
                listItem.setAttribute('data-id', item.id);
                listItem.setAttribute('data-action', 'getLocalityList');
                regionList.appendChild(listItem);
            });

            this.container.appendChild(regionList);
        }
    }

    _sendRequestLocalities(url, id) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, false);
        xhr.send();
        if (xhr.status !== 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            if (document.getElementById('localitiesList')) {
                document.getElementById('localitiesList').remove();
            }

            const parsed = JSON.parse(xhr.response);

            let localityList = document.createElement('ul'),
                listItem;

            localityList.className = 'js-localities-list localities-list';
            localityList.id = 'localitiesList';

            parsed.list.forEach((item) => {
                listItem = document.createElement('li');
                listItem.className = 'js-localities-list-item';
                listItem.innerText = item;
                listItem.setAttribute('data-id', id);
                listItem.setAttribute('data-action', 'chooseLocality');
                localityList.appendChild(listItem);
            });

            this.container.appendChild(localityList);
        }
    }

    _sendRequestForSave(url, regionId, name) {

        const xhr = new XMLHttpRequest();

        let json = JSON.stringify({
            name: name,
            region: regionId
        });

        xhr.open("POST", url, false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;

            alert(this.responseText);
        }
        xhr.send(json);
    }
}

//https://googlechrome.github.io/samples/classes-es6/
