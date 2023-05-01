import { Box, Line, System, Point } from "detect-collisions"
import _ from 'lodash'
import { match } from 'ts-pattern'
import { setupCounter } from './counter.ts'
import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const canvas = document.createElement("canvas")
canvas.width = 500
canvas.height = 500
document.body.appendChild(canvas)
const context = canvas.getContext("2d")

const system = new System()
const leftBound = new Line({x: 0, y: 0}, {x: 0, y: canvas.height}, {isStatic: true})
const rightBound = new Line({x: canvas.width, y: 0}, {x: canvas.width, y: canvas.height}, {isStatic: true})
const botBound = new Line({x: 0, y: 0}, {x: canvas.width, y: 0}, {isStatic: true})
const topBound = new Line({x: 0, y: canvas.height}, {x: canvas.width, y: canvas.height}, {isStatic: true})
const box = new Box({x: 250, y: 250}, 50, 50, {isCentered: true})
system.insert(box)
system.insert(leftBound)
system.insert(rightBound)
system.insert(topBound)
system.insert(botBound)

if (context != null) {
    context.strokeStyle = "#00FFFF"
    // NOTE: Seems like matrix math is being used under the hood, so the transformations are happening in reverse order
    context.translate(0, canvas.height)
    context.scale(1, -1)

    context.beginPath()
    system.draw(context)
    context.stroke()
}

const pressedKeys = new Set<string>()
const speed = 5
let verticalSpeed = 0
const gravity = 1

window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key
    match(key)
        .with("w", () => {
            if (!pressedKeys.has("w")) {
                verticalSpeed = 15
            }
        })
        .with("a", () => {
            pressedKeys.delete("d")
        })
        .with("d", () => {
            pressedKeys.delete("a")
        })
        .otherwise(() => null)
    pressedKeys.add(key)
    console.log(`Keydown: ${key}`)
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
    pressedKeys.delete(event.key)
    console.log(`Key released: ${event.key}`)
})

function updateState() {
    let newY = box.y + verticalSpeed//Math.max(box.y + verticalSpeed, 1)
    let newX = box.x
    pressedKeys.forEach((key: string) => {
        match(key)
            .with("a", () => {
                newX -= speed
            })
            .with("d", () => {
                newX += speed
            })
            .otherwise(() => null)
    })
    let oldPosition = {x: box.x, y: box.y}
    let newPosition = {x: newX, y: newY}

    if (system.checkCollision(new Point(newPosition), box)) {
        newPosition = {x: newX, y: newY + 1}
    }

    if (!_.isEqual(oldPosition, newPosition)) {
        const hit = system.raycast(oldPosition, newPosition)
        if (hit) {
            const {point, body} = hit


            if (body == box) {
                oldPosition = {x: point.x, y: point.y - 1}
                const hit2 = system.raycast(oldPosition, newPosition)
                if (hit2) {
                    newY = botBound.y + 1
                }
            } else {
                newY = botBound.y + 1
                console.info(oldPosition, newPosition)
            }
        }
    }
    box.setPosition(newX, newY)

    system.separate()
    verticalSpeed -= gravity
    if (system.checkCollision(box, botBound)) {
        verticalSpeed = 0
    }
}

function render() {
    context!.clearRect(0, 0, canvas.width, canvas.height)
    context!.beginPath()
    system.draw(context!)
    context!.stroke()
}

function loop() {
    updateState()
    render()
}

setInterval(loop, 1000 / 60)
