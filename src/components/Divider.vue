<template>
    <div class="flex w-full my-2" :class="{ 'flex-row-reverse': rhombusVisible && side == 'red' }">
        <div v-if="rhombusVisible" class="rhombus" />
        <div :class="side ? `divider-line-${side}` : 'divider-line'" />
    </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Side } from "@/types/championSelect.types"

defineProps({
    rhombusVisible: { type: Boolean, default: false },
    side: String as PropType<Side>,
})
</script>

<style lang="scss" scoped>
.rhombus {
    @apply border border-yellow-200 rotate-45;
    backface-visibility: hidden;
    height: 8px;
    width: 8px;
}
.divider-line {
    @apply w-full bg-yellow-200;
    margin-top: 2.5px;
    height: 1px;
}
.divider-line-blue {
    @apply w-full;
    margin-top: 2.5px;
    height: 1px;
    background: -webkit-gradient(radial, 1% 1%, 0, 50% 50%, 350, from(rgba(253, 230, 138, 1)), to(transparent));
}
.divider-line-red {
    @apply w-full;
    margin-top: 2.5px;
    height: 1px;
    background: -webkit-gradient(radial, 1% 1%, 0, 50% 50%, 350, from(transparent), to(rgba(253, 230, 138, 1)));
}
</style>
