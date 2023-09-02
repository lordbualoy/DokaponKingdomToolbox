export async function loadComponent({name, markupUrl, componentUrl}) {
    const markup = fetch(markupUrl).then(x => x.text())
    const js = import(componentUrl)
    const template = await markup
    const { default: component } = await js
    component.name = name
    component.template = template
    return component
}

export function loadComponents(components) {
    return Promise.all(components.map(x => loadComponent(x)))
}
