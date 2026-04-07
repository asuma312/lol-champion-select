<template>
    <div class="w-full px-5" v-if="champions?.length">
        <div id="cs-container" class="">
            <div v-for="(c, i) in champions" :key="i" class="portrait-wrapper">
                <ChampionsPortrait
                    clickable
                    :key="c.name"
                    :phase="phase"
                    :selected="c.id == hoveredChampion"
                    :disabled="isUnavailable(c.id)"
                    :banned="bannedChampions.some(b => b.toLowerCase() === c.id.toLowerCase())"
                    :champion="{
                        name: c.name,
                        image: `/champions/${c.id}.png`,
                    }"
                    @click="clickChampion(c.id)"
                />
            </div>
        </div>
    </div>
    <div class="mt-10 mb-5 flex justify-center">
        <div class="confirm-btn-wrapper">
            <button
                @click="confirmChampion"
                :disabled="!hoveredChampion"
                class="confirm-btn"
                :class="hoveredChampion ? 'confirm-btn--active' : 'confirm-btn--disabled'"
            >
                <span class="confirm-btn__text">{{ phase === 'ban' ? 'BAN CHAMPION' : 'CONFIRM' }}</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Phase, SingleChampion } from "@/types/championSelect.types"
import { PropType } from "vue"

import ChampionsPortrait from "./ChampionPortrait.vue"

const emit = defineEmits(["confirmedChamp", "update:hoveredChampion"])
const props = defineProps({
    champions: Array as PropType<SingleChampion[]>,
    unavailableChampions: { type: Array as PropType<string[]>, required: true },
    bannedChampions: { type: Array as PropType<string[]>, required: true },
    phase: String as PropType<Phase>,
    hoveredChampion: { type: String, default: "" },
})

const isUnavailable = (id: string): boolean =>
    props.unavailableChampions.some(b => b.toLowerCase() === id.toLowerCase())

const clickChampion = (champId: string): void => {
    if (!isUnavailable(champId)) emit("update:hoveredChampion", champId)
}

const confirmChampion = () => {
    emit("confirmedChamp", props.hoveredChampion)
    emit("update:hoveredChampion", "")
}
</script>

<style lang="scss">
#cs-container {
    height: 60vh;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 100px;
    @apply grid pt-3 overflow-y-scroll gap-2;
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

.confirm-btn {
    position: relative;
    width: 280px;
    height: 50px;
    font-family: 'Arial Narrow', Arial, sans-serif;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &__text {
        position: relative;
        z-index: 2;
    }

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
        clip-path: polygon(22px 0%, calc(100% - 22px) 0%, 100% 50%, calc(100% - 22px) 100%, 22px 100%, 0% 50%);
    }

    &--active {
        color: #e8e8e8;

        &::after {
            background: linear-gradient(180deg, #111c22 0%, #0d1820 60%, #0a1318 100%);
            box-shadow: inset 0 0 30px rgba(0,0,0,0.6);
        }

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            clip-path: polygon(22px 0%, calc(100% - 22px) 0%, 100% 50%, calc(100% - 22px) 100%, 22px 100%, 0% 50%);
            background: linear-gradient(180deg, #3d9fa8 0%, #2a7a7a 50%, #1f5e5e 100%);
            transform: scale(1.0);
        }

        &::after {
            inset: 1.5px;
            background: linear-gradient(180deg, #141e26 0%, #0e1820 50%, #0a131a 100%);
        }

        &:hover {
            color: #ffffff;
            &::before {
                background: linear-gradient(180deg, #5abfcb 0%, #3d9fa8 50%, #2a7a7a 100%);
            }
            &::after {
                background: linear-gradient(180deg, #1a2a36 0%, #132030 50%, #0e1a24 100%);
            }
        }

        &:active {
            transform: translateY(1px);
        }
    }

    &--disabled {
        color: #3a4a52;
        cursor: not-allowed;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            clip-path: polygon(22px 0%, calc(100% - 22px) 0%, 100% 50%, calc(100% - 22px) 100%, 22px 100%, 0% 50%);
            background: #1e2a30;
        }

        &::after {
            inset: 1.5px;
            background: linear-gradient(180deg, #0e1418 0%, #0a1014 100%);
        }
    }
}

.confirm-btn-wrapper {
    position: relative;
    display: inline-block;

    &::before,
    &::after {
        content: '';
        position: absolute;
        top: -4px;
        width: 10px;
        height: 10px;
        border-top: 2px solid #c8a84e;
        z-index: 10;
    }

    &::before {
        left: 18px;
        border-left: 2px solid #c8a84e;
    }

    &::after {
        right: 18px;
        border-right: 2px solid #c8a84e;
    }
}
</style>
