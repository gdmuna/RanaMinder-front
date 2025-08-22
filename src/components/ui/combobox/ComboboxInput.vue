<script setup lang="ts">
import type { ComboboxInputEmits, ComboboxInputProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { SearchIcon } from "lucide-vue-next"
import { ComboboxInput, useForwardPropsEmits } from "reka-ui"
import { cn } from "@/lib/utils"

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ComboboxInputProps & {
  class?: HTMLAttributes["class"]
}>()

const emits = defineEmits<ComboboxInputEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <div
    data-slot="command-input-wrapper"
    class="flex h-5 items-center gap-3 px-2"
  >
    <SearchIcon class="size-4 shrink-0 opacity-80 text-[#FEFCE4]" />
    <ComboboxInput
      data-slot="command-input"
      :class="cn(
        'placeholder:text-[#FEFCE4] flex h-9 w-[1rem] rounded-lg bg-transparent py-3 text-sm font-bold opacity-80 outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )"

      v-bind="{ ...forwarded, ...$attrs }"
    >
      <slot />
    </ComboboxInput>
  </div>
</template>
