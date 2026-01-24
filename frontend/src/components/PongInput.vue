<script setup lang="ts">
    import { defineProps, defineEmits, ref, watch } from 'vue'
    
    interface Props {
      label: string
      modelValue: string
      type?: string
      placeholder?: string
      required?: boolean
      error?: string
    }
    
    const props = defineProps<Props>()
    const emit = defineEmits(['update:modelValue'])
    
    const isFocused = ref(false)
    </script>
    
    <template>
      <div class="pong-input-wrapper w-1/2 mx-auto relative mb-6">
        <!-- Input -->
        <input
          :type="props.type || 'text'"
          :value="props.modelValue"
          :required="props.required"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @input="emit('update:modelValue', $event.target.value)"
          class="pong-input-field peer"
          placeholder=" "
        />
        <!-- Label -->
        <label
          class="pong-input-label absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color_accent_3)] transition-all duration-200
                 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[var(--color_accent_3)]
                 peer-placeholder-shown:text-base
                 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[var(--color_accent_1)]
                 pointer-events-none"
        >
          {{ props.label }}
        </label>
    
        <!-- Error -->
        <p v-if="props.error" class="text-[var(--color_danger)] text-sm mt-1">{{ props.error }}</p>
      </div>
    </template>
    
    <style scoped>
    .pong-input-field {
      width: 100%;
      padding: 1rem 0.75rem 0.25rem 0.75rem; /* espacio para el label */
      border: 1px solid #ccc;
      border-radius: 1rem; /* más redondo */
      outline: none;
      transition: border-color 0.2s;
      background-color:var(--color_background_1); 
      font:Oswald;
    }
    
    .pong-input-field:focus {
      border-color: var(--color_accent_1);
    }
    
    .pong-input-label {
      padding: 0 0.25rem;
      background-color: var(--color_background_1); 
    }
    </style>
    