import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';

import './css/bootstrap.css';
import './css/style.css';

class App {
  constructor() {
    this._tracker = new CalorieTracker(); //instantiate CalorieTracker obj
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

    document
      .getElementById('meal-items')
      .addEventListener('click', this._editItem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this._editItem.bind(this, 'workout'));

    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));

    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'));

    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));

    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // Validate inputs
    if (name.value === '' || calories.value === '') {
      alert('Please fill in all fields.');
      return;
    }

    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = '';
    calories.value = '';

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new Collapse(collapseItem, { toggle: true });
  }

  // START _editItem and support functions
  _editItem(type, e) {
    if (
      e.target.classList.contains('edit-btn') ||
      e.target.classList.contains('fa-pen-to-square')
    ) {
      const id = e.target.closest('.card').getAttribute('data-id');
      this._initializeEditing(type, id);
    }
  }

  _initializeEditing(type, id) {
    const editableElements = this._getEditableElements(type, id);
    if (!editableElements) return;

    this._setElementsEditable(editableElements, true);
    this._setupFinishEditing(editableElements, type, id);
  }

  //Create an instance of _finishEditing
  _setupFinishEditing(editableElements, type, id) {
    const finishEditing = () => this._finishEditing(editableElements, type, id);

    editableElements.elements.forEach((element) => {
      element.addEventListener('blur', finishEditing);
      element.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          finishEditing();
        }
      });
    });
  }

  _finishEditing(editableElements, type, id) {
    this._setElementsEditable(editableElements, false);
    this._processEditedData(type, id, editableElements);
    this._removeEditingEventListeners(editableElements);
  }

  _getEditableElements(type, id) {
    const isEditing = true;
    let elements = [];
    if (type === 'meal') {
      elements = [
        document.getElementById(`meal-name-${id}`),
        document.getElementById(`meal-calories-${id}`),
      ];
    } else {
      elements = [
        document.getElementById(`workout-name-${id}`),
        document.getElementById(`workout-calories-${id}`),
      ];
    }
    return {
      isEditing,
      elements,
    };
  }

  _removeEditingEventListeners(editableElements) {
    editableElements.elements.forEach((element) => {
      element.removeEventListener('blur', this._finishEditing);
      element.removeEventListener('keypress', this._handleKeypress);
    });
  }

  _setElementsEditable(editableElements, isEditable) {
    editableElements.elements.forEach((el) => {
      el.contentEditable = isEditable.toString();
      el.classList.toggle('editable', isEditable);
    });
  }

  _processEditedData(type, id, editableElements) {
    if (type === 'meal') {
      const editedMealName = editableElements.elements[0].innerHTML;
      const editedMealCalories = parseInt(
        editableElements.elements[1].innerText,
        10
      );
      if (id !== null) {
        const editedMeal = new Meal(editedMealName, editedMealCalories);
        this._tracker.editMeal(editedMeal, id);
      }
    } else {
      const editedWorkoutName = editableElements.elements[0].innerHTML;
      const editedWorkoutCalories = parseInt(
        editableElements.elements[1].innerText,
        10
      );
      if (id !== null) {
        const editedWorkout = new Workout(
          editedWorkoutName,
          editedWorkoutCalories
        );
        this._tracker.editWorkout(editedWorkout, id);
      }
    }
  }

  _handleKeypress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this._finishEditing();
    }
  }

  // END _editItem and support functions

  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id');

        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest('.card').remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }

  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('Please add a limit');
      return;
    }

    this._tracker.setLimit(+limit.value);
    limit.value = '';

    const modalEl = document.getElementById('limit-modal');
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
