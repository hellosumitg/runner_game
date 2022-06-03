import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js"

const SPEED = 0.05 // speed at which the ground will move.
const groundElems = document.querySelectorAll("[data-ground]") // for getting the ground UI.

export function setupGround() {
  // As in HTML file we put in two grounds so
  setCustomProperty(groundElems[0], "--left", 0)
  setCustomProperty(groundElems[1], "--left", 300) // `300` is the width of our game
}

export function updateGround(delta, speedScale) {
  // looping through the two grounds.
  groundElems.forEach(ground => {
    // 1st ground:-
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1) // here we multiply with `-1` as the ground is moving in backward direction
    // Once the 1st ground gets out of the screen we want to update the 2nd ground:-
    // reloop - again make a loop so as not to run out of space
    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600)
    }
  })
}
