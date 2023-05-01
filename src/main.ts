import { Box, Line, System } from "detect-collisions"
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
const topBound = new Line({x: 0, y: 0}, {x: canvas.width, y: 0}, {isStatic: true})
const botBound = new Line({x: 0, y: canvas.height}, {x: canvas.width, y: canvas.height}, {isStatic: true})
const box = new Box({x: 250, y: 250}, 50, 50)
system.insert(box)
system.insert(leftBound)
system.insert(rightBound)
system.insert(topBound)
system.insert(botBound)

if (context != null) {
    context.strokeStyle = "#000000"
    context.beginPath()
    system.draw(context)
    context.stroke()
}

const pressedKeys = new Set<string>()
window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key
    pressedKeys.add(key)
    match(key)
        .with("w", () => {
            pressedKeys.delete("s")
        })
        .with("a", () => {
            pressedKeys.delete("d")
        })
        .with("s", () => {
            pressedKeys.delete("w")
        })
        .with("d", () => {
            pressedKeys.delete("a")
        })
        .otherwise(() => null)
    console.log(`Keydown: ${key}`)
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
    pressedKeys.delete(event.key)
    console.log(`Key released: ${event.key}`)
})

const speed = 5
function updateState() {
    context!.clearRect(0, 0, canvas.width, canvas.height)
    context!.beginPath()

    pressedKeys.forEach((key: string) => {
        match(key)
            .with("w", () => {
                box.y -= speed
            })
            .with("a", () => {
                box.x -= speed
            })
            .with("s", () => {
                box.y += speed
            })
            .with("d", () => {
                box.x += speed
            })
            .otherwise(() => null)
    })

    system.separate()
    system.draw(context!)
    context!.stroke()
}

setInterval(updateState, 1000 / 60)