<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
      >
        <UAvatar
          :src="avatarUrl" alt="Avatar"
          size="3xl"
        />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <div class="flex items-center space-x-4">
          <UInput type="file" icon="i-heroicons-folder" ref="fileInput" accept=".jpg,.jpeg,.png,.gif"/>
          <UButton
            type="submit"
            variant="solid"
            label="Save"
            :loading="uploading"
            :disabled="uploading"
            @click="saveAvatar"
          />
        </div>
      </UFormGroup>
    </div>

    
  </div>
</template>

<script setup>

const supabase = useSupabaseClient();
const user = useSupabaseUser();

// We need to get the actual avatar URL
const { toastDone, toastError } = useToastNotification();
const { url: initialAvatarUrl } = useAvatarUrl();
const avatarUrl = ref(initialAvatarUrl);

const uploading = ref(false);
const fileInput = ref(); // Reference to an input with ref="fileInput" attribute

const saveAvatar = async () => {
  // 1. Get the uploaded file
  const file = fileInput.value.input.files[0];

  //  if no file is selected, display the message
  if (!file) {
    toastError({ title: "Please upload your avatar!", description: "You need to upload an avatar to proceed." });
    return;
  }

  // get extension of the uploaded file
  const fileExtension = file.name.split(".").pop();
  // generate unique file name with the help of random function
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

  try {
    uploading.value = true;
    // 1. Grab the current avatar URL
    const currentAvatarUrl = user.value.user_metadata?.avatar_url;

    // 2. Upload the image to avatars bucket
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 3. Update the user metadata with the avatar URL
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });
    if (updateError) throw updateError;

    // 4. (OPTIONALLY) remove the old avatar file
    if (currentAvatarUrl) {
      const { error: removeError } = await supabase.storage.from('avatars').remove([currentAvatarUrl]);
      if (removeError) throw removeError;
    }

    // 5. Reset the file input and update the avatar URL
    fileInput.value.input.value = null;
    avatarUrl.value = URL.createObjectURL(file);

    toastDone({ title: "Avatar uploaded" });
  } catch (error) {
    toastError({
      title: "Error uploading avatar",
      description: error.message,
    });
  } finally {
    uploading.value = false;
  }
};
</script>
