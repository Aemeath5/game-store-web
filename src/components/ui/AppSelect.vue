<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Check, ChevronDown, Search, X } from 'lucide-vue-next'

interface SelectOption {
  value: string
  label: string
  meta?: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue: string
  options: SelectOption[]
  ariaLabel: string
  placeholder?: string
  searchPlaceholder?: string
  searchable?: boolean
  disabled?: boolean
  variant?: 'light' | 'admin' | 'form'
  size?: 'default' | 'compact'
}>(), {
  placeholder: '请选择',
  searchPlaceholder: '搜索选项…',
  searchable: false,
  disabled: false,
  variant: 'light',
  size: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const trigger = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref('')
const panelStyle = ref<Record<string, string>>({})

const selected = computed(() => props.options.find(option => option.value === props.modelValue))
const useSearch = computed(() => props.searchable || props.options.length > 12)
const visibleOptions = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase('zh-CN')
  if (!needle)
    return props.options
  return props.options.filter(option => `${option.label}${option.meta ?? ''}${option.description ?? ''}`
    .toLocaleLowerCase('zh-CN')
    .includes(needle))
})

function updatePosition() {
  if (!trigger.value)
    return

  const rect = trigger.value.getBoundingClientRect()
  const width = Math.max(rect.width, 220)
  const left = Math.min(Math.max(12, rect.left), Math.max(12, window.innerWidth - width - 12))
  const opensAbove = window.innerHeight - rect.bottom < 280 && rect.top > window.innerHeight - rect.bottom
  const panelHeight = Math.min(panel.value?.offsetHeight ?? 360, window.innerHeight - 24)

  panelStyle.value = {
    '--select-left': `${left}px`,
    '--select-top': `${opensAbove ? Math.max(12, rect.top - panelHeight - 8) : rect.bottom + 8}px`,
    '--select-width': `${width}px`,
  }
}

function addPositionListeners() {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
}

function removePositionListeners() {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
}

async function openPanel() {
  if (props.disabled || open.value)
    return
  query.value = ''
  updatePosition()
  open.value = true
  await nextTick()
  updatePosition()
  if (useSearch.value)
    searchInput.value?.focus()
  else
    panel.value?.focus()
}

function closePanel(returnFocus = false) {
  if (!open.value)
    return
  open.value = false
  query.value = ''
  if (returnFocus)
    nextTick(() => trigger.value?.focus())
}

function togglePanel() {
  if (open.value)
    closePanel()
  else
    void openPanel()
}

function choose(option: SelectOption) {
  if (option.disabled)
    return
  emit('update:modelValue', option.value)
  closePanel(true)
}

watch(open, (isOpen) => {
  if (isOpen)
    addPositionListeners()
  else
    removePositionListeners()
})

watch(() => props.disabled, (disabled) => {
  if (disabled)
    closePanel()
})

onBeforeUnmount(removePositionListeners)
</script>

<template>
  <div class="app-select" :class="[`app-select--${variant}`, `app-select--${size}`, { 'is-open': open, 'is-disabled': disabled }]">
    <button
      ref="trigger"
      class="app-select__trigger"
      type="button"
      :disabled="disabled"
      :aria-label="ariaLabel"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="togglePanel"
      @keydown.down.prevent="openPanel"
    >
      <span v-if="$slots.prefix" class="app-select__prefix"><slot name="prefix" /></span>
      <span class="app-select__value" :class="{ 'is-placeholder': !selected }">{{ selected?.label ?? placeholder }}</span>
      <small v-if="selected?.meta" class="app-select__meta">{{ selected.meta }}</small>
      <ChevronDown class="app-select__chevron" />
    </button>

    <Teleport to="body">
      <Transition name="app-select-popover">
        <div v-if="open" class="app-select-layer" @keydown.esc.stop.prevent="closePanel(true)">
          <button class="app-select-backdrop" type="button" tabindex="-1" aria-label="关闭选项" @click="closePanel()" />
          <section
            ref="panel"
            class="app-select-panel"
            :style="panelStyle"
            role="dialog"
            :aria-label="ariaLabel"
            tabindex="-1"
          >
            <header class="app-select-panel__header">
              <div><small>SELECT</small><strong>{{ ariaLabel }}</strong></div>
              <button type="button" aria-label="关闭" @click="closePanel(true)"><X /></button>
            </header>

            <label v-if="useSearch" class="app-select-search">
              <Search />
              <input ref="searchInput" v-model="query" :placeholder="searchPlaceholder" autocomplete="off">
            </label>

            <div class="app-select-options" role="listbox" :aria-label="ariaLabel">
              <button
                v-for="option in visibleOptions"
                :key="option.value"
                class="app-select-option"
                :class="{ 'is-selected': option.value === modelValue }"
                type="button"
                role="option"
                :aria-selected="option.value === modelValue"
                :disabled="option.disabled"
                @click="choose(option)"
              >
                <span class="app-select-option__copy">
                  <strong>{{ option.label }}</strong>
                  <small v-if="option.description">{{ option.description }}</small>
                </span>
                <small v-if="option.meta" class="app-select-option__meta">{{ option.meta }}</small>
                <span class="app-select-option__check"><Check v-if="option.value === modelValue" /></span>
              </button>
              <p v-if="!visibleOptions.length" class="app-select-empty">没有匹配的选项</p>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
