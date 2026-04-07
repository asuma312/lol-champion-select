import { defineStore } from "pinia";

import { Champions, DraftStep, SessionData, SingleChampion } from "@/types/championSelect.types"
import { CHAMPION_POSITIONS } from "@/data/championPositions"

const DRAFT_ORDER: DraftStep[] = [
    { phase: 'ban', side: 'blue' },
    { phase: 'ban', side: 'red' },
    { phase: 'ban', side: 'blue' },
    { phase: 'ban', side: 'red' },
    { phase: 'ban', side: 'blue' },
    { phase: 'ban', side: 'red' },
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'red' },
    { phase: 'pick', side: 'red' },
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'red' },
    { phase: 'ban', side: 'red' },
    { phase: 'ban', side: 'blue' },
    { phase: 'ban', side: 'red' },
    { phase: 'ban', side: 'blue' },
    { phase: 'pick', side: 'red' },
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'blue' },
    { phase: 'pick', side: 'red' },
]

export const useChampions = defineStore({
    id: "useChampions",
    state: () => ({
        queryFilter: "",
        roleFilter: "all",
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
            let list = this.champions
            if (this.roleFilter !== "all") {
                const role = this.roleFilter.charAt(0).toUpperCase() + this.roleFilter.slice(1)
                list = list.filter((c) => (CHAMPION_POSITIONS[c.name] ?? []).some((p) => p.toLowerCase() === role.toLowerCase()))
            }
            if (this.queryFilter) {
                list = list.filter((c) => c.name.toLowerCase().includes(this.queryFilter.toLowerCase()))
            }
            return list
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
                    this.champions = championsData.map((val: SingleChampion) => ({ name: val.name, id: val.id, tags: val.tags ?? [] })) as []
                })
                .catch(err => {
                    console.error(err);
                })
        },
        setFilter(filter: string): void {
            this.queryFilter = filter
        },
        setRoleFilter(role: string): void {
            this.roleFilter = role
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
