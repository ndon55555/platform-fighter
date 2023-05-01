import { Box, System } from "detect-collisions"
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
document.body.appendChild(canvas)
const context = canvas.getContext("2d")

const system = new System()
const box = new Box({x: 1, y: 1}, 50, 50)
system.insert(box)

if (context != null) {
    context.strokeStyle = "#000000"
    context.beginPath()
    system.draw(context)
    context.stroke()
}

const pressedKeys = new Set<string>()
window.addEventListener("keydown", (event: KeyboardEvent) => {
    pressedKeys.add(event.key)
    console.log(`Keydown: ${event.key}`)
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
    pressedKeys.delete(event.key)
    console.log(`Key released: ${event.key}`)
})

function updateState() {
    context!.clearRect(0, 0, canvas.width, canvas.height)
    context!.beginPath()

    pressedKeys.forEach((key: string) => {
        match(key)
            .with("w", () => {
                box.y -= 1
            })
            .with("a", () => {
                box.x -= 1
            })
            .with("s", () => {
                box.y += 1
            })
            .with("d", () => {
                box.x += 1
            })
            .otherwise(() => null)
    })

    
    system.draw(context!)
    context!.stroke()
}

setInterval(updateState, 1000/60)