import { updateGround, setupGround } from "./ground.js"
import { updatePlayer, setupPlayer, getPlayerRect, setPlayerLose } from "./player.js" // getPlayerRect() will get the dimensions of our player, use to check any collisions
import { updateObstacle, setupObstacle, getObstacleRects } from "./obstacle.js" // getObstacleRects() will get the dimensions of the obstacle, use to check collisions
import { updateNft, setupNft, getNftRects } from "./nft.js" // getNftRects() will get the dimensions of the NFT Image, use to check any collisions

const GAME_WIDTH = 100
const GAME_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const gameElem = document.querySelector("[data-game]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")
const gweiTotalScoreEleme = document.querySelector("[data-wei-total-score]")
const nftTotalScoreElem = document.querySelector("[data-nft-total-score]")
const nftScoreElem = document.querySelector("[data-nft-score ]")

setPixelToGameScale()
window.addEventListener("resize", setPixelToGameScale)
document.addEventListener("keydown", handleStart, { once: true }) 

let lastTime
let speedScale
let score
let nftScore = 0

// below function is for updating our player on each frame.
function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update) // this function is called whenever we render content on screen
    return
  }
  const delta = time - lastTime // for calculating time between frames.

  updateGround(delta, speedScale)
  updatePlayer(delta, speedScale)
  updateObstacle(delta, speedScale)
  updateNft(delta, speedScale)
  updateSpeedScale(delta)
  updateScore(delta)
  checkIfWeGotNft()
  // if there is a collision lose the game and reset all the variables..
  if (checkLose()) return handleLose()
  lastTime = time
  window.requestAnimationFrame(update) // this function is called whenever we render content on screen
}

// below function is to check if there is a collision between the player and the obstacles so as to checkLose of the player.
function checkLose() {
  const playerRect = getPlayerRect()
  return getObstacleRects().some(rect => isCollision(rect, playerRect))
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top 
  )
}

function checkIfWeGotNft() {
  const playerRect = getPlayerRect()
  if(getNftRects().some(rect => isCollision(rect, playerRect))) {
    const nftToRemove = document.querySelectorAll("[data-nft]")[0]
    nftToRemove.remove() // If there is a collision between player and NFT image then, remove that NFTImage from the Game UI
    nftScore += 1 // Increase the NFT score with 1 as the player get collided with the NFTImage.
    nftScoreElem.textContent = `nft score: ${nftScore}` // for updating the UI
  }
  return getNftRects().some(rect => isCollision(rect, playerRect))
}

// below function is to increase the speed of the game.
function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
}

// below function is for updating the score element(i.e UI) of the player
function updateScore(delta) {
  // how much you get here is calculated
  // console.log("delta u update score function = ", delta)
  score += delta * 0.01
  scoreElem.textContent = `Wei score: ${Math.floor(score)}` // Math.floor() is for converting to whole number.
}

function handleStart() {
  lastTime = null
  speedScale = 1
  score = 0
  setupGround()
  setupPlayer()
  setupObstacle()
  setupNft()
  startScreenElem.classList.add("hide") // this is for saying press any key to start.
  // call this only when screen refershes
  window.requestAnimationFrame(update)
}

// below objects we get in the browser...
window.totalNFTScore = 0
window.totalGweiScore = 0

// below function is for adding various scores which we got till the end of the gaming session.
function handleLose() {
  window.totalGweiScore += Math.floor(score)  
  window.totalNFTScore += nftScore

  nftTotalScoreElem.textContent = `NFT total score: ${window.totalNFTScore}`
  gweiTotalScoreEleme.textContent = `Wei total score ${window.totalGweiScore}`

  nftScore = 0 // reseting to zero
  nftScoreElem.textContent = `nft score: ${nftScore}`
  setPlayerLose()
  // save
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true })
    startScreenElem.classList.remove("hide")
  }, 100) // this function will help us to start the game again after 100 secs when we click the button after claiming the rewards.
}

// below function is for making our game responsive for different screen sizes.
function setPixelToGameScale() {
  let gameToPixelScale
  if ( (window.innerWidth / window.innerHeight) < (GAME_WIDTH / GAME_HEIGHT) ) {
    gameToPixelScale = (window.innerWidth / GAME_WIDTH)
  } else {
    gameToPixelScale = (window.innerHeight / GAME_HEIGHT)
  }
  // below code is for updating the width and height in our game elements. 
  gameElem.style.width = `${GAME_WIDTH * gameToPixelScale}px`
  gameElem.style.height = `${GAME_HEIGHT * gameToPixelScale}px`
}

