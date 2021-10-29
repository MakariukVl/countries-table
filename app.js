const appRoot = document.getElementById('app-root');

const SORT_ORDER = {
  NONE: 0,
  ASC: 1,
  DESC: 2
};
let sortTableConf = {
  by: 'name',
  order: SORT_ORDER.ASC,
  area: function () {
    return this.by === 'area' ? this.order : SORT_ORDER.NONE;
  },
  name: function () {
    return this.by === 'name' ? this.order : SORT_ORDER.NONE;
  }
};

window.onload = () => {
  startApp();
};

const onChangeRadioHandler = e => {
  const searchType = e.target.value;
  let newForm = createForm(searchType);
  let oldForm = document.querySelector('#search-form');
  oldForm.replaceWith(newForm);
  for (const radio of newForm.querySelectorAll('input[name=filter]')) {
    radio.addEventListener('change', onChangeRadioHandler);
  }
  let select = newForm.querySelector('select[name=query]');
  select.addEventListener('change', onChangeSearchTypeHandler);

  const query = select.value;
  let newTable = createTable(searchType, query, sortTableConf);
  let oldTable = document.querySelector('#table-wrapper');
  if (oldTable) {
    oldTable.replaceWith(newTable);
  } else {
    let appWrapper = document.querySelector('#wrapper');
    appWrapper.appendChild(newTable);
  }
};

const onChangeSearchTypeHandler = e => {
  sortTableConf.by = 'name';
  sortTableConf.order = SORT_ORDER.ASC;
  const query = e.target.value;
  const searchType =
    document.querySelector('input[name=filter]:checked').value || 'none';
  let newTable = createTable(searchType, query, sortTableConf);
  let oldTable = document.querySelector('#table-wrapper');
  if (oldTable) {
    oldTable.replaceWith(newTable);
  } else {
    let appWrapper = document.querySelector('#wrapper');
    appWrapper.appendChild(newTable);
  }

  let arrows = document.querySelectorAll('.arrow-sort');
  arrows.forEach(arrow => {
    arrow.addEventListener('click', onClickArrowHandler);
  });
};

const onClickArrowHandler = e => {
  const sortBy = e.target.getAttribute('value');
  if (sortTableConf.by === sortBy) {
    sortTableConf.order =
      sortTableConf.order === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
  } else {
    sortTableConf.by = sortBy;
    sortTableConf.order = SORT_ORDER.ASC;
  }
  sortTableConf.by = sortBy;

  const query = document.getElementById('query-select').value;
  let searchType =
    document.querySelector('input[name=filter]:checked').value || 'none';
  let newTable = createTable(searchType, query, sortTableConf);
  let oldTable = document.querySelector('#table-wrapper');
  if (oldTable) {
    oldTable.replaceWith(newTable);
  } else {
    let appWrapper = document.querySelector('#wrapper');
    appWrapper.appendChild(newTable);
  }

  let arrows = newTable.querySelectorAll('.arrow-sort');
  arrows.forEach(arrow => {
    arrow.addEventListener('click', onClickArrowHandler);
  });
};

function startApp() {
  appRoot.innerHTML = '';
  let appWrapper = document.createElement('div');
  appWrapper.classList.add('content');
  appWrapper.id = 'wrapper';
  appWrapper.appendChild(document.createElement('h1'));

  let header = appWrapper.lastChild;
  header.appendChild(document.createTextNode('Countries Search'));

  let form = createForm();
  for (const radio of form.querySelectorAll('input[name=filter]')) {
    radio.addEventListener('change', onChangeRadioHandler);
  }
  appWrapper.appendChild(form);

  appRoot.appendChild(appWrapper);
}

function createForm(searchType = 'none') {
  let form = document.createElement('form');
  form.setAttribute('name', 'search');
  form.setAttribute('action', '');
  form.classList.add('search');
  form.id = 'search-form';
  let searchTypeWrapper = document.createElement('div');
  form.appendChild(searchTypeWrapper);

  searchTypeWrapper.classList.add('form-row', 'flex-wrapper');
  let searchTypeHint = document.createElement('div');
  let searchTypeRadio = document.createElement('div');
  searchTypeWrapper.appendChild(searchTypeHint);
  searchTypeWrapper.appendChild(searchTypeRadio);

  searchTypeHint.classList.add('form-cell');
  searchTypeHint.appendChild(
    document.createTextNode('Please choose the type of search:')
  );

  searchTypeRadio.classList.add('form-cell');
  let radioRegion = document.createElement('input');
  let labelRegion = document.createElement('label');
  let br = document.createElement('br');
  let radioLanguage = document.createElement('input');
  let labelLanguage = document.createElement('label');
  searchTypeRadio.appendChild(radioRegion);
  searchTypeRadio.appendChild(labelRegion);
  searchTypeRadio.appendChild(br);
  searchTypeRadio.appendChild(radioLanguage);
  searchTypeRadio.appendChild(labelLanguage);

  radioRegion.setAttribute('type', 'radio');
  radioRegion.setAttribute('name', 'filter');
  radioRegion.setAttribute('value', 'region');
  radioRegion.checked = searchType === 'region';
  radioRegion.id = 'by-region';
  labelRegion.setAttribute('for', 'by-region');
  labelRegion.appendChild(document.createTextNode('By Region'));
  radioLanguage.setAttribute('type', 'radio');
  radioLanguage.setAttribute('name', 'filter');
  radioLanguage.setAttribute('value', 'language');
  radioLanguage.checked = searchType === 'language';
  radioLanguage.id = 'by-language';
  labelLanguage.setAttribute('for', 'by-language');
  labelLanguage.appendChild(document.createTextNode('By Language'));

  let queryWrapper = document.createElement('div');
  form.appendChild(queryWrapper);
  queryWrapper.id = 'query-row';
  queryWrapper.classList.add('form-row', 'flex-wrapper');
  let queryHint = document.createElement('div');
  let querySelectWrapper = document.createElement('div');
  queryWrapper.appendChild(queryHint);
  queryWrapper.appendChild(querySelectWrapper);

  queryHint.classList.add('form-cell');
  queryHint.appendChild(document.createTextNode('Please choose search query:'));
  querySelectWrapper.classList.add('form-cell');
  let querySelect = document.createElement('select');
  querySelectWrapper.appendChild(querySelect);
  querySelect.id = 'query-select';
  querySelect.classList.add('query');
  querySelect.setAttribute('name', 'query');
  let defaultOption = document.createElement('option');
  querySelect.appendChild(defaultOption);
  defaultOption.setAttribute('value', '');
  defaultOption.selected = true;
  defaultOption.appendChild(document.createTextNode('Select value'));

  switch (searchType) {
    case 'region':
      externalService.getRegionsList().forEach(region => {
        let regionOption = document.createElement('option');
        regionOption.setAttribute('value', region);
        regionOption.appendChild(document.createTextNode(region));
        querySelect.appendChild(regionOption);
      });
      break;
    case 'language':
      Array.from(externalService.getLanguagesList()).forEach(language => {
        let languageOption = document.createElement('option');
        languageOption.setAttribute('value', language);
        languageOption.appendChild(document.createTextNode(language));
        querySelect.appendChild(languageOption);
      });
      break;
    default:
      querySelect.disabled = true;
      break;
  }

  return form;
}

function createTable(typeOfSearch, searchQuery, sortConf) {
  let tableDefault = document.createElement('div');
  tableDefault.id = 'table-wrapper';
  tableDefault.classList.add('table-wrapper', 'flex-wrapper');
  tableDefault.appendChild(
    document.createTextNode('No items, please choose search query')
  );

  let tableWrapper = document.createElement('div');
  tableWrapper.id = 'table-wrapper';
  tableWrapper.classList.add('table-wrapper', 'flex-wrapper');
  let table = document.createElement('table');
  tableWrapper.appendChild(table);

  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');
  table.appendChild(thead);
  table.appendChild(tbody);

  let headers = document.createElement('tr');
  thead.appendChild(headers);
  let countryHeader = document.createElement('th');
  countryHeader.appendChild(document.createTextNode('Country name'));
  let countryArrow = document.createElement('span');
  countryHeader.appendChild(countryArrow);
  countryArrow.id = 'country-sort';
  countryArrow.classList.add('arrow-sort');
  countryArrow.setAttribute('value', 'name');
  countryArrow.setAttribute('title', 'Sorting order');
  countryArrow.appendChild(document.createTextNode(getArrow(sortConf.name())));
  let capitalHeader = document.createElement('th');
  capitalHeader.appendChild(document.createTextNode('Capital'));
  let regionHeader = document.createElement('th');
  regionHeader.appendChild(document.createTextNode('World region'));
  let languagesHeader = document.createElement('th');
  languagesHeader.appendChild(document.createTextNode('Languages'));
  let areaHeader = document.createElement('th');
  areaHeader.appendChild(document.createTextNode('Area'));
  let areaArrow = document.createElement('span');
  areaHeader.appendChild(areaArrow);
  areaArrow.id = 'area-sort';
  areaArrow.classList.add('arrow-sort');
  areaArrow.setAttribute('value', 'area');
  areaArrow.setAttribute('title', 'Sorting order');
  areaArrow.appendChild(document.createTextNode(getArrow(sortConf.area())));
  let flagHeader = document.createElement('th');
  flagHeader.appendChild(document.createTextNode('Flag'));

  headers.appendChild(countryHeader);
  headers.appendChild(capitalHeader);
  headers.appendChild(regionHeader);
  headers.appendChild(languagesHeader);
  headers.appendChild(areaHeader);
  headers.appendChild(flagHeader);

  let data = [];
  switch (typeOfSearch) {
    case 'region':
      data = externalService.getCountryListByRegion(searchQuery);
      break;
    case 'language':
      data = externalService.getCountryListByLanguage(searchQuery);
      break;
    default:
      break;
  }

  data = sort(data, sortConf.by, sortConf.order);
  data.forEach(country => {
    let record = document.createElement('tr');
    tbody.appendChild(record);
    let countryData = document.createElement('td');
    countryData.appendChild(document.createTextNode(country.name));
    let capitalData = document.createElement('td');
    capitalData.appendChild(document.createTextNode(country.capital));
    let regionData = document.createElement('td');
    regionData.appendChild(document.createTextNode(country.region));
    let languagesData = document.createElement('td');
    languagesData.appendChild(
      document.createTextNode(Object.values(country.languages).join(', '))
    );
    let areaData = document.createElement('td');
    areaData.appendChild(document.createTextNode(country.area));
    let flagData = document.createElement('td');
    let flagImg = document.createElement('img');
    flagImg.setAttribute('src', country.flagURL);
    flagImg.setAttribute('alt', 'flag');
    flagData.appendChild(flagImg);

    record.appendChild(countryData);
    record.appendChild(capitalData);
    record.appendChild(regionData);
    record.appendChild(languagesData);
    record.appendChild(areaData);
    record.appendChild(flagData);
  });

  return data.length === 0 ? tableDefault : tableWrapper;
}

function sort(arr, sortBy, sortOrder) {
  let sortedArr = arr;
  switch (sortBy) {
    case 'area':
      const numberComparer =
        sortOrder === SORT_ORDER.ASC
          ? (a, b) => a[sortBy] - b[sortBy]
          : (a, b) => b[sortBy] - a[sortBy];
      sortedArr = arr.sort(numberComparer);
      break;

    default:
      const strComparer =
        sortOrder === SORT_ORDER.ASC
          ? (a, b) => a[sortBy].localeCompare(b[sortBy])
          : (a, b) => b[sortBy].localeCompare(a[sortBy]);
      sortedArr = arr.sort(strComparer);
      break;
  }
  return sortedArr;
}

function getArrow(sortingOrder) {
  const ARROW_UP = '\u2191',
    ARROW_DOWN = '\u2193',
    ARROW_UPDOWN = '\u2195';
  let arrow;
  switch (sortingOrder) {
    case SORT_ORDER.ASC:
      arrow = ARROW_UP;
      break;
    case SORT_ORDER.DESC:
      arrow = ARROW_DOWN;
      break;
    default:
      arrow = ARROW_UPDOWN;
      break;
  }
  return arrow;
}
