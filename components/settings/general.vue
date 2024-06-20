<template>
  <UForm :state="state" :schema="schema" @submit="saveSettings">
    <UFormGroup
      label="Transaction View"
      class="mb-4"
      help="Choose how you would like to view transactions"
    >
      <USelect v-model="state.transactionView" :options="transactionViewOptions.map(option => ({ label: option, value: option }))"/>
    </UFormGroup>

    <UButton
      type="submit"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup>
import { z } from 'zod';
import { transactionViewOptions } from '~/constants';

const { toastDone, toastError } = useToastNotification();
const pending = ref(false);
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const state = ref({
  transactionView: user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1]
});

const schema = z.object({
  transactionView: z.enum(transactionViewOptions)
});

const saveSettings = async () => {
  pending.value = true;
  console.log(state.value.transactionView)
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.value.transactionView
      }
    });
    if (error) throw error;
    toastDone({
      title: "Settings updated"
    });
  } catch (error) {
    toastError({
      title: "Error updating settings",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<style scoped>
/* */
</style>
