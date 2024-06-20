<template>
  <div class="grid grid-cols-3 py-2 border-b border-gray-200 text-gray-900">
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-2">
        <UIcon :name="icon" :class="[iconColor]" class="min-w-6"/>
        <div>{{ transaction.description }}</div>
      </div>
      <div class="hidden sm:block">
        <UBadge :color="badgeColor" variant="outline" v-if="transaction.category_name">{{
          transaction.category_name
        }}</UBadge>
      </div>
    </div>

    <div class="flex items-center justify-end ml-1 space-x-1 col-span-1">
      <div>{{ formatCurrency(transaction.amount) }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }" :ui="{ background: 'bg-gray-100', base: 'hover:bg-gray-50'}">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
          <ModalTransaction v-model="isOpen" :transaction="transaction" @saved="handleSaved" />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: Object
});

const emit = defineEmits(["deleted", "edited"]);

const { toastDone, toastError } = useToastNotification();
const isLoading = ref(false);
const supabase = useSupabaseClient();
const isOpen = ref(false);

const deleteTransaction = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", props.transaction.id);
    if (error) throw error;
    toastDone({
      title: "Transaction deleted successfully"
    });
    emit("deleted", props.transaction.id);
  } catch (error) {
    toastError({
      title: "Failed to delete transaction",
      description: error.message,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleSaved = () => {
  emit('edited');
  isOpen.value = false;
};

const isIncome = computed(() => props.transaction.type_name === "Income");
const icon = computed(() =>
  isIncome.value ? "i-heroicons-arrow-up-right" : "i-heroicons-arrow-down-right"
);
const iconColor = computed(() =>
  isIncome.value ? "text-green-600" : "text-red-600"
);
const badgeColor = computed(() =>
  isIncome.value ? 'primary' : 'red'
);

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => (isOpen.value = true),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTransaction,
    },
  ],
];
</script>

