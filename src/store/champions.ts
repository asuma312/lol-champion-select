import { defineStore } from "pinia";

import { Champions, Side, SingleChampion, } from '@/types/championSelect.types'

export const useChampions = defineStore({
    id: "useChampions",
    state: () => ({
        queryFilter: "",
        champions: [] as SingleChampion[],
        bans: {
            red: [] as Champions,
            blue: [] as Champions
        },
    }),
    getters: {
        filteredChampions(): SingleChampion[] {
            return this.queryFilter ? this.champions.filter((c: SingleChampion) => c.name.toLowerCase().includes(this.queryFilter.toLowerCase())) : this.champions
        },
        bannedChampions(): string[] {
            return [...this.bans.red.map(c => c.name), ...this.bans.blue.map(c => c.name)]
        }
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

        banChampion(side: Side, champ: string): void {
            if (this.bans[side].length < 5) {
                this.bans[side].push({ name: champ, image: `/champions/${champ}.png` })
            }
        }

    }
})