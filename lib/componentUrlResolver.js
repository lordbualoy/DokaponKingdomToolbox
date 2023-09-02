export function resolveUrl(componentName) {
    const basePath = `components/${componentName}/${componentName}`
    return { name: componentName, markupUrl: `${basePath}.html`, componentUrl: `../${basePath}.js` }
}

export function resolveUrls(componentNames) {
    return componentNames.map(resolveUrl)
}
