<template>
  <UModal v-model="isOpen">
    <UCard class="bg-gray-50">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-gray-900">{{ isEditing ? "Edit" : "Add" }} Transaction</span>
          <UButton
            icon="i-heroicons-x-circle"
            color="red"
            variant="ghost"
            @click="closeModal"
          />
        </div>
      </template>
      <UForm
        :state="state"
        :schema="schema"
        ref="form"
        @submit="handleFormSubmit"
      >
        <UFormGroup label="Amount" :required="true" class="mb-4" name="amount">
          <UInput
            type="number"
            placeholder="Enter amount of your new transaction"
            v-model.number="state.amount"
          />
        </UFormGroup>
        <UFormGroup
          label="Transaction Date and Time"
          :required="true"
          class="mb-4"
          name="created_at"
        >
          <UInput
            type="datetime-local"
            placeholder="Enter date and time of your new transaction"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>
        <UFormGroup label="Type" :required="true" class="mb-4" name="type_id">
          <USelect
            :disabled="isEditing"
            placeholder="Select type of your transaction"
            :options="transactionTypes"
            v-model="state.type_id"
            @change="updateCategories"
          ></USelect>
        </UFormGroup>
        <UFormGroup
          label="Category"
          class="mb-4"
          name="category_id"
          :required="true"
        >
          <USelect
            :disabled="!state.type_id"
            :options="categories"
            placeholder="Select category of your transaction"
            v-model="state.category_id"
          />
        </UFormGroup>
        <UFormGroup
          label="Description"
          class="mb-4"
          name="description"
          :required="true"
        >
          <UInput
            type="text"
            placeholder="Describe your transaction in a few words"
            v-model="state.description"
          />
        </UFormGroup>
        <UFormGroup
          label="Payment Method"
          class="mb-4"
          name="payment_method_id"
        >
          <URadioGroup v-model="state.payment_method_id" :options="paymentMethods" />
        </UFormGroup>

        <div class="flex justify-end">
          <UButton type="submit" :loading="isLoading">Save Transaction</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
  import { z } from 'zod';

  const props = defineProps({
    modelValue: Boolean,
    transaction: {
      type: Object,
      required: false,
    },
  });

  const emit = defineEmits(['update:modelValue', 'saved']);

  const isEditing = computed(() => !!props.transaction);
  const isLoading = ref(false);
  const form = ref();
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  const { toastDone, toastError } = useToastNotification();

  const getCurrentDateTime = () => {
    const date = new Date();
    return date.toISOString().slice(0, 16);
  };

  const state = ref({
    type_id: undefined,
    amount: 0,
    created_at: getCurrentDateTime(),
    description: '',
    category_id: undefined,
    payment_method_id: 2, // Default to Transfer
  });

  const transactionTypes = ref([]);
  const categories = ref([]);
  const paymentMethods = ref([
    { label: 'Cash', value: 1 },
    { label: 'Transfer', value: 2 }
  ]);

  const fetchOptions = async () => {
    const { data: typesData } = await supabase.from('transactiontypes').select('*');
    transactionTypes.value = typesData.map((type) => ({ label: type.name, value: type.id }));

    updateCategories(); // Fetch categories based on the initial type
  };

  const updateCategories = async () => {
    if (!state.value.type_id) {
      categories.value = [];
      return;
    }
    
    const { data: categoriesData } = await supabase
      .from('categorytransactiontypes')
      .select('category_id, categories(name)')
      .eq('transaction_type_id', state.value.type_id);

    categories.value = categoriesData.map((cat) => ({
      label: cat.categories.name,
      value: cat.category_id
    }));
  };

  onMounted(fetchOptions);

  watch(() => props.transaction, (newTransaction) => {
    if (newTransaction) {
      state.value = {
        type_id: newTransaction.type_id,
        amount: newTransaction.amount,
        created_at: newTransaction.created_at.slice(0, 16),
        description: newTransaction.description,
        category_id: newTransaction.category_id,
        payment_method_id: newTransaction.payment_method_id,
      };
      updateCategories();
    }
  }, { immediate: true });

  const schema = z.object({
    description: z.string(),
    amount: z.number().positive('Amount must be greater than 0'),
  });

  async function handleFormSubmit() {
    const validationResult = schema.safeParse(state.value);
    
    if (!validationResult.success) {
      console.log("error: ", validationResult.error);
      return;
    }

    try {
      isLoading.value = true;
      
      const dataToSend = {
        ...state.value,
        id: props.transaction?.id,
        user_id: user.value.id,
        type_id: parseInt(state.value.type_id), // Chuyển đổi type_id thành số nguyên
        category_id: parseInt(state.value.category_id), // Chuyển đổi category_id thành số nguyên
        created_at: new Date(state.value.created_at).toISOString() // Đảm bảo created_at có định dạng ISO
      };
      
      const { error } = await supabase
        .from('transactions')
        .upsert(dataToSend);

      if (!error) {
        toastDone({ title: 'Transaction successfully saved!', desc: 'Please reload the page to see the changes.' });
        emit('saved');
        isOpen.value = false;
        return;
      }
      throw error;
    } catch (error) {
      toastError({ title: 'Transaction cannot be saved! Please check your info.', desc: error.message });
    } finally {
      isLoading.value = false;
    }
  }

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value);
    },
  });
  const closeModal = () => {
    isOpen.value = false;
  };

  watch(isOpen, (newVal) => {
    if (!newVal) {
      state.value = {
        type_id: undefined,
        amount: 0,
        created_at: getCurrentDateTime(),
        description: '',
        category_id: undefined,
        payment_method_id: 2, // Default to Transfer
      };
    }
  });
</script>

<style scoped>
/* */
</style>