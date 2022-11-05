const BASE_URL = 'https://restcountries.com/v3.1/name/'
const fields = 'fields=name,capital,population,flags,languages'

// Функция fetchCountries(name) делает HTTP-запрос на ресурс name
//  и возвращает промис с массивом стран - отфильтрованным по полям результатом запроса.
export function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}?${fields}`)
    .then(response => response.json())
    .catch(error => console.log(error))
}
