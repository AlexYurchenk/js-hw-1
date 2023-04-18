const refs = {
    form: document.querySelector('.js-form'),
    ageInputField: document.querySelector('.js-age'),
    contentInputField: document.querySelector('.js-value'),
    enqueueButton: document.querySelector('.js-enqueue'),
    dequeueButton: document.querySelector('.js-dequeue'),
    currentContentValue: document.querySelector('.js-content'),
    queue: document.querySelector('.js-queue'),
    formTitle: document.querySelector('.js-title'),
};
const ITEMS = 'items';
const AGE = 'age';
const savedItems = localStorage.getItem(ITEMS);
const savedAge = localStorage.getItem(AGE);
class Queue {
    #items = savedItems ? JSON.parse(savedItems) : [];
    #maxLength = savedAge ? Number(JSON.parse(savedAge)) : null;

    enqueue(item) {
        if (this.#items.length + 1 > this.#maxLength) {
            throw new Error('The maximum queue size has been reached');
        }
        this.#items = [item, ...this.#items];
    }
    dequeue() {
        this.#items = [...this.#items.slice(0, this.#items.length - 1)];
    }
    getItems() {
        return this.#items;
    }
    setMaxLength(age) {
        if (age <= 0) {
            throw new Error('Your age con not be less or equal to 0');
        }
        this.#maxLength = age;
    }
    getMaxLength() {
        return this.#maxLength;
    }
}
const queue = new Queue();

let currentValue = '';

const handleFromSubmit = (event) => {
    try {
        event.preventDefault();
        const age = Number(refs.ageInputField.value.trim());
        const value = refs.contentInputField.value.trim();
        if (age) {
            queue.setMaxLength(age);
            localStorage.setItem(AGE, age);
        }
        if (!age && refs.ageInputField.style.display !== 'none') {
            throw new Error('Put your age');
        }
        if (!value) {
            throw new Error('Put your value');
        }
        currentValue = value;
        refs.ageInputField.style.display = 'none';
        formReset();
        refs.currentContentValue.innerHTML = currentValue;
    } catch (error) {
        handleError(error);
    }
};

const handleError = (error) => {
    alert(error);
    formReset();
};
const handleEnqueueClick = () => {
    try {
        if (!currentValue) {
            throw new Error('You do not have values to enqueue');
        }
        if (refs.dequeueButton.disabled === true) {
            refs.dequeueButton.disabled = false;
        }
        queue.enqueue(currentValue);
        localStorage.setItem(ITEMS, JSON.stringify(queue.getItems()));
        currentValue = '';
        updateMarkUp();
    } catch (error) {
        handleError(error);
    }
};
const handleDequeueClick = () => {
    try {
        if (queue.getItems().length === 0) {
            refs.dequeueButton.disabled = true;
            throw new Error('The queue is empty');
        }

        queue.dequeue();
        localStorage.setItem(ITEMS, JSON.stringify(queue.getItems()));
        currentValue = '';
        updateMarkUp();
    } catch (error) {
        handleError(error);
    }
};
const updateMarkUp = () => {
    const queueMarkUp = makeQueue(queue.getItems());
    refs.currentContentValue.innerHTML = currentValue;
    refs.queue.innerHTML = queueMarkUp;
};
const formReset = () => {
    refs.ageInputField.value = '';
    refs.contentInputField.value = '';
};
const makeQueue = (items) => {
    return items.length === 0
        ? ''
        : items
              .map(
                  (i) =>
                      `<li class="queue__item"><span class="queue__content">${i}</span></li>`
              )
              .join('');
};
refs.form.addEventListener('submit', handleFromSubmit);
refs.enqueueButton.addEventListener('click', handleEnqueueClick);
refs.dequeueButton.addEventListener('click', handleDequeueClick);

if (queue.getMaxLength()) {
    refs.ageInputField.style.display = 'none';
    refs.formTitle.innerHTML = `Queue max length is ${queue.getMaxLength()}`;
}
if (!queue.getMaxLength()) {
    refs.formTitle.style.display = 'none';
}
if (!savedItems) {
    refs.dequeueButton.disabled = true;
}
if (savedItems) {
    const items = JSON.parse(savedItems);
    const queueMarkUp = makeQueue(items);
    refs.queue.innerHTML = queueMarkUp;
}
