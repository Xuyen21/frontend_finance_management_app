<template>
  <UForm :state="state" :schema="schema" @submit="saveProfile">
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup class="mb-4" label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UButton type="submit" :loading="pending" :disabled="pending">Save</UButton>
  </UForm>
</template>

<script setup>
import { z } from "zod";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastDone, toastError } = useToastNotification();
const pending = ref(false);

const state = ref({
  name: user.value?.user_metadata?.full_name || '',
  email: user.value?.email || '',
});

const schema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
});

const saveProfile = async (e) => {
  pending.value = true;

  const validationResult = schema.safeParse(state.value);
  if (!validationResult.success) {
    toastError({
      title: "Validation Error",
      desc: validationResult.error.errors.map(err => err.message).join(", "),
    });
    pending.value = false;
    return;
  }

  try {
    const data = {
      data: {
        full_name: state.value.name,
      },
    };
    // if user entered a new email, then new email will be updated
    if (state.value.email !== user.value.email) {
      data.email = state.value.email;
    }

    const { error } = await supabase.auth.updateUser(data);
    if (error) throw error;

    toastDone({
      title: "Done",
      desc: "Your profile is successfully updated",
    });
  } catch (err) {
    toastError({
      title: "Your profile cannot be updated",
      desc: err.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<style scoped>
/* */
</style>
