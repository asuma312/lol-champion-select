<template>
    <div class="relative w-full select-none">
        <Background style="z-index: -1" :phase="currentPhase" :champion="hoveredChampion" />
        <div class="flex w-full text-gray-200 h-screen z-50">
            <div id="blue-side" class="w-1/4 flex flex-col">
                <div class="w-full px-5 mb-5">
                    <Bans side="blue" :bans="champStore.bans.blue" />
                </div>
                <div class="flex flex-col justify-center flex-1">
                    <TeamPicks
                        side="blue"
                        :champions="champStore.picks.blue"
                        :position="'left'"
                        :hoveredChampion="blueTurnHovered"
                        :isActiveTurn="currentTurnSide === 'blue' && currentPhase === 'pick'"
                    />
                </div>
            </div>

            <div id="champion-list" class="w-1/2 flex flex-col">
                <div class="cs-header">
                    <p class="cs-header__title">{{ currentPhase === 'ban' ? 'BAN A CHAMPION!' : 'CHOOSE YOUR CHAMPION!' }}</p>
                    <div class="cs-timer">
                        <div class="cs-timer__bar-track">
                            <div class="cs-timer__bar-fill" :style="{ width: `${timerProgress * 100}%`, background: timerBarColor }" />
                        </div>
                        <span class="cs-timer__number" :style="{ color: timerNumberColor }">{{ timeLeft }}</span>
                    </div>
                </div>
                <div class="flex flex-col justify-center flex-1">
                    <GridHeader @queryUpdated="champStore.setFilter" @roleUpdated="champStore.setRoleFilter" />
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
            </div>

            <div id="red-side" class="w-1/4 flex flex-col">
                <div class="w-full px-5 mb-5">
                    <Bans side="red" :bans="champStore.bans.red" />
                </div>
                <div class="flex flex-col justify-center flex-1">
                    <TeamPicks
                        side="red"
                        :champions="champStore.picks.red"
                        position="right"
                        :hoveredChampion="redTurnHovered"
                        :isActiveTurn="currentTurnSide === 'red' && currentPhase === 'pick'"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import { useChampions } from "@/store/champions"
import { useTimer } from "@/composables/useTimer"
import { CHAMPION_POSITIONS } from "@/data/championPositions"

import Bans from "@/components/Bans.vue"
import ChampionsGrid from "@/components/ChampionsGrid.vue"
import GridHeader from "@/components/GridHeader.vue"
import TeamPicks from "@/components/TeamPicks.vue"
import Background from "@/components/Background.vue"

const TURN_DURATION = 30
const SLOT_ROLES = ["Top", "Jungle", "Mid", "Bottom", "Support"]

const champStore = useChampions()
champStore.getChampionList()

const hoveredChampion = ref<string>("")
const currentPhase = computed(() => champStore.currentTurn?.phase ?? 'ban')
const currentTurnSide = computed(() => champStore.currentTurn?.side ?? 'blue')

const blueTurnHovered = computed(() => currentTurnSide.value === 'blue' && currentPhase.value === 'pick' ? hoveredChampion.value : '')
const redTurnHovered = computed(() => currentTurnSide.value === 'red' && currentPhase.value === 'pick' ? hoveredChampion.value : '')

const { timeLeft, progress: timerProgress, start: startTimer } = useTimer(TURN_DURATION)

const autoConfirm = () => {
    if (champStore.isDraftComplete) return

    const unavailable = new Set(champStore.unavailableChampions.map(n => n.toLowerCase()))
    let pool = champStore.champions.filter(c => !unavailable.has(c.id.toLowerCase()) && !unavailable.has(c.name.toLowerCase()))

    if (currentPhase.value === 'pick') {
        const slotIndex = champStore.picks[currentTurnSide.value].length
        const role = SLOT_ROLES[slotIndex] ?? "Top"
        const rolePool = pool.filter(c => (CHAMPION_POSITIONS[c.name] ?? []).includes(role as any))
        if (rolePool.length > 0) pool = rolePool
    }

    if (pool.length === 0) return
    handleConfirm(pool[Math.floor(Math.random() * pool.length)].id)
}

watch(() => champStore.draftStep, () => startTimer(), { immediate: true })
watch(timeLeft, (val) => { if (val === 0) autoConfirm() })

const timerBarColor = computed(() => {
    if (timerProgress.value > 0.5) return 'linear-gradient(90deg, #0ac8b9, #0397ab)'
    if (timerProgress.value > 0.25) return 'linear-gradient(90deg, #e6a817, #c8831e)'
    return 'linear-gradient(90deg, #c83232, #8b1a1a)'
})

const timerNumberColor = computed(() => {
    if (timerProgress.value > 0.5) return '#c8aa6e'
    if (timerProgress.value > 0.25) return '#e6a817'
    return '#c83232'
})

const handleConfirm = (champ: string): void => {
    champStore.confirmChampion(champ)
    hoveredChampion.value = ""
}
</script>

<style lang="scss">
.cs-header {
    text-align: center;
    padding: 12px 0 8px;
}

.cs-header__title {
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #c8aa6e;
    text-shadow: 0 0 20px rgba(200, 168, 78, 0.5), 0 0 40px rgba(200, 168, 78, 0.2);
    margin-bottom: 8px;
}

.cs-timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.cs-timer__bar-track {
    width: 220px;
    height: 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 2px;
    overflow: hidden;
}

.cs-timer__bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.9s linear, background 0.5s ease;
}

.cs-timer__number {
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    line-height: 1;
    transition: color 0.5s ease;
    text-shadow: 0 0 16px currentColor;
}
</style>
