<template>
    <div class="w-full px-5" v-if="champions?.length">
        <div id="cs-container" class="">
            <div v-for="(c, i) in champions" :key="i" class="portrait-wrapper">
                <ChampionsPortrait
                    clickable
                    :key="c.name"
                    :phase="phase"
                    :selected="c.id == hoveredChampion"
                    :disabled="isChampBanned(c.id)"
                    :champion="{
                        name: c.name,
                        image: `/champions/${c.id}.png`,
                    }"
                    @click="clickChampion(c.id)"
                />
            </div>
        </div>
    </div>
    <div class="mt-10 mb-5">
        <button
            @click="banChampion"
            class="text-white font-bold py-2 px-4 rounded"
            :class="hoveredChampion ? 'bg-blue-500 hover:bg-blue-700' : ' bg-gray-500'"
            :disabled="!hoveredChampion"
        >
            Ban champion
        </button>
    </div>
</template>

<script lang="ts" setup>
import { Phase, SingleChampion } from "@/types/championSelect.types"
import { PropType } from "vue"

import ChampionsPortrait from "./ChampionPortrait.vue"

const emit = defineEmits(["bannedChamp", "update:hoveredChampion"])
const props = defineProps({
    champions: Array as PropType<SingleChampion[]>,
    bannedChampions: { type: Array as PropType<string[]>, required: true },
    phase: String as PropType<Phase>,
    hoveredChampion: { type: String, default: "" },
})

const clickChampion = (champId: string): void => {
    if (isChampBanned(champId)) {
        return
    }
    emit("update:hoveredChampion", champId)
}

//TODO: Fix name/id confusion around types

const isChampBanned = (name: string): boolean => {
    return props.bannedChampions.some(b => b.toLowerCase() === name.toLowerCase())
}

const banChampion = () => {
    emit("bannedChamp", {
        side: "blue",
        champ: props.hoveredChampion,
    })
    emit("update:hoveredChampion", "")
}
</script>

<style lang="scss">
#cs-container {
    height: 65vh;
    grid-auto-rows: 110px;
    @apply grid grid-cols-6 pt-3 overflow-y-scroll gap-1;
}
#cs-container::-webkit-scrollbar {
    @apply w-2 max-h-2;
}
#cs-container::-webkit-scrollbar-thumb {
    @apply bg-yellow-500 bg-opacity-60 rounded-2xl;
}
#cs-container::-webkit-scrollbar-corner {
    background-color: rgba(0, 0, 0, 0);
}
.portrait-wrapper {
    max-height: 100px;
}
</style>
