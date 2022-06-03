import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

// ground and obstacle should move at the same speeed
const SPEED = 0.05
// min. time to spawn/create an obstacle is 500 milliseconds
const OBSTACLE_INTERVAL_MIN = 500
// max time to spawn/create an obstacle should be longer than 2000 miliseconds
const OBSTACLE_INTERVAL_MAX = 2000
// we need this element to add the elements to our game
const worldElem = document.querySelector("[data-game]")

let nextObstacleTime
export function setupObstacle() {
  // spawn/create an obstacle quickly once the game starts
  nextObstacleTime = OBSTACLE_INTERVAL_MIN
  // remove all obstacles before the game starts again
  document.querySelectorAll("[data-obstacle]").forEach(obstacle => {
    obstacle.remove()
  })
}

export function updateObstacle(delta, speedScale) {
  // looping and quering over all obstacles
  document.querySelectorAll("[data-obstacle]").forEach(obstacle => {
    incrementCustomProperty(obstacle, "--left", delta * speedScale * SPEED * -1)
    if (getCustomProperty(obstacle, "--left") <= -100) { // If these obstacles have a left poroperty less than -100( defined in the css)
      obstacle.remove() // then we'll remove them as they're out of the screen.
    }
  })

  if (nextObstacleTime <= 0) {
    createObstacle()
    // speedscale is here to spawn/create faster obstacle in the game to make it more difficult
    nextObstacleTime =
      randomNumberBetween(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX) / speedScale
  }
  // make the next obstacle time smaller to eventually reach 0 and spawn/create new obstacle
  nextObstacleTime -= delta
}

// below function will get the dimensions of the obstacle, use to check collisions
export function getObstacleRects() {
  return [...document.querySelectorAll("[data-obstacle]")].map(obstacle => {
    // this getBoundingClientRect gives out the dimensions for our obstacle
    return obstacle.getBoundingClientRect()
  })
}

function createObstacle() {
  const obstacle = document.createElement("img")
  obstacle.dataset.obstacle = true // here we are creating the [data-obstacle] property so as to reference it later
  // todo: set img nft image for `nft.js` rest all code would be same like in this `obstacle.js` file
  obstacle.src = "imgs/obstacle.png"
  // todo: change to  `nft.src` for `nft.js` rest all code would be same like in this `obstacle.js` file
  obstacle.classList.add("obstacle")
  setCustomProperty(obstacle, "--left", 100)
  worldElem.append(obstacle)
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
