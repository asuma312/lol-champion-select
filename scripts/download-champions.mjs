import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DDRAGON_VERSION = '12.11.1'
const CHAMPION_LIST_URL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/en_US/champion.json`
const ICON_URL = (id) => `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${id}.png`
const SPLASH_URL = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`

const ICONS_DIR = path.join(__dirname, '../public/champions')
const SPLASH_DIR = path.join(__dirname, '../public/champions/splash')

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) {
            resolve('skipped')
            return
        }
        const file = fs.createWriteStream(dest)
        const client = url.startsWith('https') ? https : http
        client.get(url, (res) => {
            if (res.statusCode !== 200) {
                file.close()
                fs.unlinkSync(dest)
                reject(new Error(`HTTP ${res.statusCode} for ${url}`))
                return
            }
            res.pipe(file)
            file.on('finish', () => file.close(() => resolve('downloaded')))
        }).on('error', (err) => {
            file.close()
            if (fs.existsSync(dest)) fs.unlinkSync(dest)
            reject(err)
        })
    })
}

async function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
                try { resolve(JSON.parse(data)) }
                catch (e) { reject(e) }
            })
        }).on('error', reject)
    })
}

async function main() {
    ensureDir(ICONS_DIR)
    ensureDir(SPLASH_DIR)

    console.log(`Fetching champion list (version ${DDRAGON_VERSION})...`)
    const data = await fetchJson(CHAMPION_LIST_URL)
    const champions = Object.values(data.data)
    console.log(`${champions.length} champions found.\n`)

    let downloaded = 0
    let skipped = 0
    let errors = 0

    for (let i = 0; i < champions.length; i++) {
        const champ = champions[i]
        const { id } = champ
        const progress = `[${i + 1}/${champions.length}]`

        // Icon
        try {
            const iconResult = await downloadFile(ICON_URL(id), path.join(ICONS_DIR, `${id}.png`))
            if (iconResult === 'downloaded') downloaded++
            else skipped++
        } catch (e) {
            console.error(`${progress} ERROR icon ${id}: ${e.message}`)
            errors++
        }

        // Splash
        try {
            const splashResult = await downloadFile(SPLASH_URL(id), path.join(SPLASH_DIR, `${id}_0.jpg`))
            if (splashResult === 'downloaded') downloaded++
            else skipped++
        } catch (e) {
            console.error(`${progress} ERROR splash ${id}: ${e.message}`)
            errors++
        }

        process.stdout.write(`\r${progress} ${id.padEnd(20)} | downloaded: ${downloaded} | skipped: ${skipped} | errors: ${errors}`)
    }

    console.log(`\n\nDone!`)
    console.log(`  Downloaded : ${downloaded}`)
    console.log(`  Skipped    : ${skipped} (already existed)`)
    console.log(`  Errors     : ${errors}`)
    console.log(`\nImages saved to:`)
    console.log(`  Icons   : public/champions/<ChampId>.png`)
    console.log(`  Splashes: public/champions/splash/<ChampId>_0.jpg`)
}

main().catch(console.error)
