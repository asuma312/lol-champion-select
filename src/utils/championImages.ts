const DDRAGON_VERSION = '12.11.1'

export function onIconError(event: Event) {
    const img = event.target as HTMLImageElement
    if (img.src.includes('ddragon')) return
    const filename = img.src.split('/').pop()
    if (filename) {
        img.src = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${filename}`
    }
}

export function onSplashError(event: Event) {
    const img = event.target as HTMLImageElement
    if (img.src.includes('ddragon')) return
    const filename = img.src.split('/').pop()
    if (filename) {
        img.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${filename}`
    }
}
