'use strict';

const phonesUrl
= 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

function getPhonesFromApi() {
  return fetch(phonesUrl);
}

function timeout() {
  return new Promise((resolve, reject) => {
    setTimeout(() => (
      reject(new Error('Error'))
    ), 5000);
  });
}

function getPhonesWithTimeout() {
  return Promise.race([
    getPhonesFromApi(),
    timeout(),
  ])
    .then(response => {
      return response.json();
    });
}

function getPhones() {
  return getPhonesWithTimeout()
    .then(phones => {
      const phonesIds = phones.map(phone => phone.id);

      return phonesIds;
    });
}

function getDetails(ids) {
  const detailsList = ids.map(id => {
    return fetch(
      // eslint-disable-next-line max-len
      `https://mate-academy.github.io/phone-catalogue-static/api/phones/${id}.json`
    )
      .then(response => response.json());
  });

  return Promise.all(detailsList);
}

function createList(detailsList) {
  const list = document.createElement('ul');

  detailsList.map(element => {
    const li = document.createElement('li');

    li.textContent = element.name;

    list.append(li);
  });

  document.body.append(list);
};

getPhones(phonesUrl)
  .then(getDetails)
  .then(createList);
