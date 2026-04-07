<template>
    <div class="w-full flex justify-center mt-5" :class="{ 'flex-row-reverse': props.side == 'blue' }">
        <div v-for="i in 5" :key="i" class="w-10 aspect-square relative bg-black border-2 border-gray-400 mr-2">
            <div v-if="checkBan(i - 1)">
                <img :key="i" :src="bans?.[i - 1].image" :alt="bans?.[i - 1].name" @error="onIconError" />
            </div>
            <div class="w-2/3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" v-else>
                <BanIcon />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Champions, Side } from "@/types/championSelect.types"
import { onIconError } from "@/utils/championImages"
import BanIcon from "./icons/BanIcon.vue"

const props = defineProps({
    bans: Array as PropType<Champions>,
    side: String as PropType<Side>,
})

const checkBan = (index: number): string | null | undefined => {
    return props.bans ? props.bans[index]?.name : null
}
</script>
