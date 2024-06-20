<template>
  <div class="flex flex-col items-center justify-center">
    <UCard class="bg-slate-300 shadow-lg">
      <Welcome @showLogin="showLogin = true" :showLogin="showLogin" />
      <div v-if="showLogin">
        <UCard v-if="!success" class="bg-gray-50 text-gray-800 m-4">
          <template #header> Sign in </template>
          <form @submit.prevent="handleLogin">
            <UFormGroup
              label="Email"
              :required="true"
              name="email"
              help="We will send you an email for confirmation"
            >
              <UInput
                type="email"
                placeholder="enter your email"
                required
                v-model="email"
              ></UInput>
            </UFormGroup>
            <UButton
              label="Sign in"
              type="submit"
              :loading="pending"
              :disabled="pending"
              class="mt-1"
            ></UButton>
          </form>
        </UCard>
        <UCard v-else class="bg-gray-50 text-gray-800 m-4">
          <template #header> Thank you for submitting your email! </template>
          <div>
            <p>
              Please check your email: <strong>{{ email }}</strong> to log in
            </p>
          </div>
        </UCard>
      </div>
  </UCard>
  </div>
</template>

<script setup>
const success = ref(false);
const email = ref("");
const pending = ref(false);
const showLogin = ref(false); // Control whether to show the login form
const {toastDone, toastError} = useToastNotification();
const supabase = useSupabaseClient();
const config = useRuntimeConfig();
const baseUrl = config.public.SUPABASE_URL;
const emailRedirectTo = new URL('/confirmation', baseUrl);
console.log(emailRedirectTo.href);
useRedirecting();

const handleLogin = async () => {
  pending.value = true;
  try {
    const { data, err } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: emailRedirectTo.href
      }
    });

    if (err) {
      const invalidTitle = "Your provided email is not valid";
      console.log(invalidTitle)
      toastError({
        "title": invalidTitle,
        "description": err.message
      });
    } else {
      toastDone({'title': "logged you in"})
      success.value = true;
    }
  } catch (e) {
  } finally {
    pending.value = false;
  }
};

definePageMeta({
  layout: 'login',
});
</script>
