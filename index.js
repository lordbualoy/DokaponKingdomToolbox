import { loadComponents } from 'componentLoader'
import { resolveUrls } from 'componentUrlResolver'
const { createApp } = Vue

const components = await loadComponents(
    resolveUrls([
        'App',
        'CharacterInfo',
        'Checkbox',
        'Dropdown',
        'Table',
    ])
)
const componentLookup = new Map(components.map(x => [x.name, x]))

const div = document.createElement('div')
document.body.append(div)
const app = createApp(componentLookup.get('App'))

for (const component of components)
    app.component(component.name, component)

app.mount(div)
