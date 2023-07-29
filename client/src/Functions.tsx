/**
 * Преобразовывает число в удобный для отображения формат
 * @param x число
 * @returns преобразованное число
 */
function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Перевести первый символ строки в верхний регистр
 * @param str строка
 * @returns изменённая строка
 */
function capitalize(str: string) : string{
    return str?(str[0].toUpperCase()+str.slice(1)):'';
}

/**
 * Проверяет валидность эл. почты
 * @param email строка
 * @returns является строка эл. почтой или нет
 */
const validateEmail = (email : string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const titles = {
  main: '',
  search: 'Поиск',
  reviews: (roomTitle: string) => `Отзывы - ${roomTitle}`,
  details: (roomTitle: string) => roomTitle,
  profile: (name: string) => `Профиль - ${name}`,
  login: 'Вход',
  filter: 'Фильтр',
  rentout: ''
}

/**
 * Меняет title
 * @param newTitle новый title
 */
function setTitle(newTitle: string) {
  document.title = `Rusbnb ${newTitle?' - ':''}${newTitle}`;
}

export {numberWithSpaces, capitalize, validateEmail, setTitle, titles}