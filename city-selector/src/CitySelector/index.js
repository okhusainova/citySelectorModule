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
        this.container.addEventListener('click', this.getLocalitiesList());
        this.container.addEventListener('click', this.saveLocation());
        this.container.addEventListener('click', this.destroy());
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
            this.container.appendChild(chooseRegion);
        });
    }

    getRegionsList() {
        const url = this._regionsUrl;
        console.log('getRegionsList');
        document.body.addEventListener('click', (event) => {

            const clickedEl = event.target;

            if (clickedEl.className.indexOf('js-choose-region') === -1) {
                return;
            } else {
                this._sendRequestRegions(url);
            }
        });
    }

    getLocalitiesList() {
        document.body.addEventListener('click', (event) => {
            const clickedEl = event.target;
            const _id = clickedEl.getAttribute('data-id');
            const url = this._localitiesUrl + '/' + _id;

            console.log(url);

            if (clickedEl.className.indexOf('js-regions-list-item') === -1) {
                return;
            } else {
                if (document.getElementById('saveLocation')) {
                    document.getElementById('saveLocation').disabled = true;
                }
                this.detectClickedElement(clickedEl);
                this._sendRequestLocalities(url, _id);
            }
        });
    }

    saveLocation() {
        document.body.addEventListener('click', (event) => {
            const clickedEl = event.target,
                  _id =  clickedEl.getAttribute('data-id'),
                  _name = clickedEl.innerText;

            console.log('id', _id);
            console.log('_name', _name);

            if (clickedEl.className.indexOf('js-localities-list-item') === -1) {
                return;
            } else {
                const saveBtn = document.createElement('button');

                if (document.getElementById('saveLocation')) {
                    document.getElementById('saveLocation').remove();
                }

                this.detectClickedElement(clickedEl);

                saveBtn.className = 'js-save-location';
                saveBtn.id = 'saveLocation';
                saveBtn.innerText = 'Сохранить';
                this.container.appendChild(saveBtn);
                this.sendLocality(_id, _name);
            }
        });
    }

    destroy() {
        document.body.addEventListener('click', (event) => {
            const clickedEl = event.target;

            if (clickedEl.id.indexOf('destroyCitySelector') === -1) {
                return;
            } else {
                this.container.innerHTML = '';
            }
        })
    }

    sendLocality(id, name) {
        document.body.addEventListener('click', (event) => {
            const clickedEl = event.target,
                  url = this._saveUrl;

            if (clickedEl.className.indexOf('js-save-location') === -1) {
                return;
            } else {
                this._sendRequestForSave(url, id, name);
            }
        })
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

            console.log('regionList', regionList);
            regionList.className = 'js-regions-list regions-list';
            regionList.id = 'regionsList';


            parsed.forEach((item) => {
                listItem = document.createElement('li');
                listItem.className = 'js-regions-list-item regions-list__item';
                listItem.innerText = item.title;
                listItem.setAttribute('data-id', item.id);
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

            console.log(parsed);

            let localityList = document.createElement('ul'),
                listItem;

            localityList.className = 'js-localities-list localities-list';
            localityList.id = 'localitiesList';

            parsed.list.forEach((item) => {
                listItem = document.createElement('li');
                listItem.className = 'js-localities-list-item';
                listItem.innerText = item;
                listItem.setAttribute('data-id', id);
                localityList.appendChild(listItem);
                console.log('listItem', listItem);
            });

            this.container.appendChild(localityList);
        }
    }

    _sendRequestForSave(url, regionId, name) {

        var xhr = new XMLHttpRequest();

        var json = JSON.stringify({
            name: name,
            region: regionId
        });

        xhr.open("POST", url, false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;

            alert( this.responseText );
        }

        xhr.send(json);
    }
}


//https://googlechrome.github.io/samples/classes-es6/
