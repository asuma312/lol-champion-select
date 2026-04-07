<template>
    <div class="relative">
        <div class="w-full flex flex-col justify-center">
            <img
                class="z-10 aspect-square self-center object-cover"
                :class="[
                    {
                        grayscale: props.disabled || selected,
                        'rounded-full': props.rounded,
                        'border-2 border-yellow-400': side == 'blue',
                        'border-2 border-red-700': side == 'red',
                        'border border-red-700': props.phase == 'ban',
                    },
                    clickable && props.phase && `cursor-pointer hover-effects${props.phase}`,
                ]"
                :style="props.banned ? 'filter: grayscale(100%)' : ''"
                :key="champion?.name"
                :src="champion?.image"
                :alt="champion?.name"
                :width="imageSize"
                :height="imageSize"
                @error="onIconError"
            />
            <p class="text-sm text-center" v-if="!hideName">{{ champion?.name }}</p>
            <div
                v-if="selected && phase == 'pick'"
                class="z-50 absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border-2 border-yellow-400 overlay aspect-square"
            />
            <HoverIcon
                :width="imageSize"
                v-if="selected"
                class="z-50 cursor-pointer absolute top-0 left-1/2 -translate-x-1/2"
                :color="phase == 'ban' ? '#b91c1c' : '#fbbf24'"
            />
            <BanIcon
                :width="imageSize"
                v-if="selected && phase == 'ban'"
                class="z-50 cursor-pointer absolute top-0 left-1/2 -translate-x-1/2"
                :color="'#b91c1c'"
            />
            <BanIcon
                :width="imageSize"
                v-if="props.banned"
                class="z-50 absolute top-0 left-1/2 -translate-x-1/2"
                color="#6b7280"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from "vue"

import { ChampionPortrait, Phase, Side } from "@/types/championSelect.types"
import { onIconError } from "@/utils/championImages"

import HoverIcon from "./icons/HoverIcon.vue"
import BanIcon from "./icons/BanIcon.vue"

const props = defineProps({
    champion: Object as PropType<ChampionPortrait>,
    clickable: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    hideName: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    banned: {
        type: Boolean,
        default: false,
    },
    selected: {
        type: Boolean,
        default: false,
    },
    side: String as PropType<Side>,
    phase: String as PropType<Phase>,
})

//TODO: find a way to handle portrait and overlays size better
const imageSize = 80
const imageSizePx = computed(() => `${imageSize}px`)
</script>

<style lang="scss" scoped>
.grayscale {
    filter: grayscale(100%);
}
.overlay {
    width: v-bind(imageSizePx);
}
.hover-effects-pick:hover {
    @apply border-2 border-yellow-400;
}
.hover-effects-ban:hover {
    @apply border-2 border-red-700;
}
</style>
