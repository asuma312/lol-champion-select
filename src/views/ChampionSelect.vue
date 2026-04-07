<template>
    <div class="relative w-full select-none">
        <Background style="z-index: -1" :phase="currentPhase" :champion="hoveredChampion" />
        <div class="flex w-full text-gray-200 h-full z-50">
            <div id="blue-side" class="w-1/4">
                <div class="w-full px-5 mb-5">
                    <Bans side="blue" :bans="champStore.bans.blue" />
                </div>
                <div class="flex flex-col justify-center">
                    <TeamPicks side="blue" :champions="champStore.picks.blue" :position="'left'" />
                </div>
            </div>

            <div id="champion-list" class="w-1/2">
                <div class="w-full text-center mb-5 mt-3">
                    <p class="text-2xl">CHOOSE YOUR CHAMPION!</p>
                    <p class="text-lg mt-1" :class="currentTurnSide === 'blue' ? 'text-blue-400' : 'text-red-400'">
                        {{ turnLabel }}
                    </p>
                </div>
                <div>
                    <GridHeader @queryUpdated="updateFilter" />
                </div>
                <div class="w-full text-center overflow-hidden">
                    <ChampionsGrid
                        v-model:hoveredChampion="hoveredChampion"
                        :champions="champStore.filteredChampions"
                        :unavailableChampions="champStore.unavailableChampions"
                        :bannedChampions="champStore.bannedChampions"
                        :phase="currentPhase"
                        @confirmedChamp="handleConfirm"
                    />
                </div>
            </div>

            <div id="red-side" class="w-1/4">
                <div class="w-full px-5 mb-5">
                    <Bans side="red" :bans="champStore.bans.red" />
                </div>
                <div class="flex flex-col justify-center">
                    <TeamPicks side="red" :champions="champStore.picks.red" position="right" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import { useChampions } from "@/store/champions"

import Bans from "@/components/Bans.vue"
import ChampionsGrid from "@/components/ChampionsGrid.vue"
import GridHeader from "@/components/GridHeader.vue"
import TeamPicks from "@/components/TeamPicks.vue"
import Background from "@/components/Background.vue"

const champStore = useChampions()

champStore.getChampionList()

const hoveredChampion = ref<string>("")

const currentPhase = computed(() => champStore.currentTurn?.phase ?? 'ban')
const currentTurnSide = computed(() => champStore.currentTurn?.side ?? 'blue')

const turnLabel = computed(() => {
    if (champStore.isDraftComplete) return 'Draft Complete'
    const side = currentTurnSide.value === 'blue' ? 'BLUE SIDE' : 'RED SIDE'
    const action = currentPhase.value === 'ban' ? 'BAN' : 'PICK'
    const step = champStore.draftStep + 1
    return `${side} — ${action} (${step}/20)`
})

const updateFilter = (name: string): void => {
    champStore.setFilter(name)
}

const handleConfirm = (champ: string): void => {
    champStore.confirmChampion(champ)
    hoveredChampion.value = ""
}
</script>
