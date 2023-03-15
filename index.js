const form = document.querySelector('.search');
const input = document.getElementById('input');
const button = document.querySelector('.button');
const usersList = document.getElementById('table-body');
const errorLine = document.createElement('span');
errorLine.id = 'error_line';
errorLine.classList.add('error-line');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  usersList.innerHTML = '';
  const inputValue = Object.fromEntries(new FormData(event.target));
  const spiner = document.querySelector('.spinner');

  if (!inputValue?.name) {
    errorLine.innerText = 'Введите минимум один символ';
    form.appendChild(errorLine);
    input.classList.add('error');
  } else {
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${inputValue.name}&per_page=10`
      );
      spiner.style.display = 'block';

      const data = await response.json();

      if (response.ok && Number(data?.total_count) > 0) {
        data.items.forEach((item) => {
          usersList.appendChild(createRepos(item));
        });
      } else {
        throw new Error('Repository is not found');
      }
    } catch (error) {
      input.classList.add('error');
      form.appendChild(errorLine);
      errorLine.innerText = 'Ничего не найдено';
    } finally {
      spiner.style.display = '';
    }
  }
});

function createRepos(userData) {
  const listItem = document.createElement('tr');

  listItem.classList.add('list-item');
  listItem.innerHTML = `<tr><td><a href="${userData.html_url}"target="blank">${
    userData.name
  }</a></td><td><p>${userData.language || 'Unknown'}</p></td><td><p>${
    userData.description || 'Unknown'
  }</p></td></tr>`;
  listItem.insertAdjacentElement('beforeend', createDeleteButton());
  usersList.append(listItem);

  function createDeleteButton() {
    const element = document.createElement('button');

    element.classList.add('delete-button');
    element.innerText = 'Удалить';
    element.addEventListener('click', () => {
      listItem.remove();
    });
    return element;
  }
  return listItem;
}
input.onfocus = function () {
  this.style.outline = 'none';
  this.classList.add('focused');
};
input.oninput = function () {
  if (this.classList.contains('error')) {
    this.classList.remove('error');
  }
  const error = form.querySelector('#error_line');
  if (error) {
    error.remove();
  }
};
input.onblur = function () {
  this.classList.remove('focused');
};
