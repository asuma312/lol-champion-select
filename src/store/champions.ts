import { defineStore } from "pinia";

import { Champions, DraftStep, SessionData, Side, SingleChampion } from "@/types/championSelect.types"

const DRAFT_ORDER: DraftStep[] = [
    // Phase 1 Bans (3 per team, alternating)
    { phase: 'ban', side: 'blue' },
    { phase: 'ban', side: 'red' },
    { phase: 'ban', side: 'blue' },
    { phase: 'ban', side: 'red' },
    { phase: 'ban', side: 'blue' },
    { phase: 'ban', side: 'red' },
    // Phase 1 Picks (B1, R1-2, B2-3, R3)
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'red' },
    { phase: 'pick', side: 'red' },
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'red' },
    // Phase 2 Bans (2 per team, red starts)
    { phase: 'ban', side: 'red' },
    { phase: 'ban', side: 'blue' },
    { phase: 'ban', side: 'red' },
    { phase: 'ban', side: 'blue' },
    // Phase 2 Picks (R4, B4-5, R5)
    { phase: 'pick', side: 'red' },
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'red' },
]

export const useChampions = defineStore({
    id: "useChampions",
    state: () => ({
        queryFilter: "",
        champions: [] as SingleChampion[],
        bans: {
            red: [] as Champions,
            blue: [] as Champions
        },
        picks: {
            red: [] as Champions,
            blue: [] as Champions
        },
        draftStep: 0,
    }),
    getters: {
        filteredChampions(): SingleChampion[] {
            return this.queryFilter ? this.champions.filter((c: SingleChampion) => c.name.toLowerCase().includes(this.queryFilter.toLowerCase())) : this.champions
        },
        sessionData(): SessionData {
            return {
                bans: {
                    blue: this.bans.blue.map((c) => c.name),
                    red: this.bans.red.map((c) => c.name),
                },
                picks: {
                    blue: this.picks.blue.map((c) => c.name),
                    red: this.picks.red.map((c) => c.name),
                },
            }
        },
        bannedChampions(): string[] {
            return [...this.sessionData.bans.red, ...this.sessionData.bans.blue]
        },
        pickedChampions(): string[] {
            return [...this.sessionData.picks.red, ...this.sessionData.picks.blue]
        },
        unavailableChampions(): string[] {
            return [...this.bannedChampions, ...this.pickedChampions]
        },
        currentTurn(): DraftStep | null {
            return DRAFT_ORDER[this.draftStep] ?? null
        },
        isDraftComplete(): boolean {
            return this.draftStep >= DRAFT_ORDER.length
        },
    },
    actions: {
        getChampionList() {
            fetch("http://ddragon.leagueoflegends.com/cdn/12.11.1/data/en_US/champion.json")
                .then((res) => res.json())
                .then((response) => {
                    const championsData = Object.values(response.data) as SingleChampion[]
                    this.champions = championsData.map((val: SingleChampion) => ({ name: val.name, id: val.id })) as []
                })
                .catch(err => {
                    console.error(err);
                })
        },
        setFilter(filter: string): void {
            this.queryFilter = filter
        },
        confirmChampion(champ: string): void {
            const step = DRAFT_ORDER[this.draftStep]
            if (!step) return
            const portrait = { name: champ, image: `/champions/${champ}.png` }
            if (step.phase === 'ban') {
                this.bans[step.side].push(portrait)
            } else {
                this.picks[step.side].push(portrait)
            }
            this.draftStep++
        },
        resetDraft(): void {
            this.bans = { red: [], blue: [] }
            this.picks = { red: [], blue: [] }
            this.draftStep = 0
        },
        getSessionJson(): string {
            return JSON.stringify(this.sessionData, null, 2)
        },
    },
})
