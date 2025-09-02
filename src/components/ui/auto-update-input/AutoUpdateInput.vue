<template>
    <Input 
        v-bind="$attrs" 
        @blur="onInputBlur"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    fieldName: string;
    stageIndex?: number;
    sessionIndex?: number;
    timeSlotIndex?: number;
}>();

const emit = defineEmits<{
    (e: 'update', fieldName: string, value: any, stageIndex?: number, sessionIndex?: number, timeSlotIndex?: number): void;
}>();

const onInputBlur = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit('update', props.fieldName, target.value, props.stageIndex, props.sessionIndex, props.timeSlotIndex);
};
</script>
