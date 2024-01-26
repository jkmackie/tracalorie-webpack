class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem('calorieLimit');
    }
    return calorieLimit;
  }
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem('totalCalories');
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals')); // string to array
    }
    return meals;
  }

  static saveMeal(meal, id) {
    const meals = Storage.getMeals();
    const existingMealIndex = meals.findIndex((meal) => meal.id === id);

    if (existingMealIndex !== -1) {
      meals[existingMealIndex] = meal; // Update existing meal
    } else {
      meals.push(meal); // Add new meal
    }
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1); // remove
      }
    });
    // re-save without the meal
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem('workouts') === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts')); // string to array
    }
    return workouts;
  }

  static saveWorkout(workout, id) {
    const workouts = Storage.getWorkouts();
    const existingWorkoutIndex = workouts.findIndex((workout) => workout.id === id);

    if (existingWorkoutIndex !== -1) {
      workouts[existingWorkoutIndex] = workout; // Update existing workout
    } else {
      workouts.push(workout); // Add new workout
    }
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });
    // re-save without the workout
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem('totalCalories');
    localStorage.removeItem('meals');
    localStorage.removeItem('workouts');

    //localStorage.clear();
  }
}

export default Storage;
