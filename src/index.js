import './css/styles.css';
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix'
import { fetchCountries } from './js/fetchCountries'

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Прием Debounce на обработчике события делает HTTP-запрос спустя 300мс после того, 
// как пользователь перестал вводить текст
searchBox.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput(e) {
    e.preventDefault();
    
  const name = searchBox.value.trim()// Метод trim() решает проблему когда в поле ввода только пробелы или они есть в начале и в конце строки

// Если пользователь полностью очищает поле поиска, то HTTP-запрос не выполняется,
// а разметка списка стран или информации о стране пропадает.
    if (name === '') {
      
        return (clearCountryList(), clearCountryInfo());
    }
// Функция, которая делает HTTP-запрос на ресурс name и возвращает промис с массивом стран-результатом запроса
fetchCountries(name) 
    .then(countries => {
        clearCountryList();
        clearCountryInfo();
// Если результат запроса это массив с одной страной, в интерфейсе отображается разметка карточки с данными о стране: флаг, название, столица, население и языки.
        if (countries.length === 1) {
          countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
          countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
        }
// Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется уведомление о том, что имя должно быть более специфичным.
        else if (countries.length >= 10) {
          alertTooManyMatches();
        }
// Если бэкенд вернул от 2-х до 10-х стран, под тестовым полем отображается список найденных стран. Каждый элемент списка состоит из флага и имени страны.
        else {
          countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
      }
    })
// Если пользователь ввёл имя страны которой не существует, бэкенд вернёт не пустой массив, 
// а ошибку со статус кодом 404 - не найдено.Если это не обработать, то пользователь никогда не узнает о том,
// что поиск не дал результатов. Добавь уведомление "Oops, there is no country with that name"
      .catch(alertWrongName)
}
// Функция разметки списка стран
function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 40px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
    })
    .join('')
  
    return markup
}

// Функция разметки карточки с данными о стране: столица, население и языки.
function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      
        return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join('=>')}</p></li>
        </ul>
        `
    })
    .join('')
  
    return markup
}

// Функция вывода сообщения, когда поиск не дал результатов
function alertWrongName() {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}

// Функция вывода строки "Too many matches found. Please enter a more specific name.", 
// когда бэкенд вернул больше чем 10 стран
function alertTooManyMatches() {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

// Функция очистки разметки списка стран
function clearCountryList() {
  countryList.innerHTML = '';
}

// Функция очистки информации о стране
function clearCountryInfo() {
  countryInfo.innerHTML = '';
}

countryInfo.setAttribute('style', 'color: grey; text-transform: uppercase;');
countryList.setAttribute('style', 'list-style-type: none;');

