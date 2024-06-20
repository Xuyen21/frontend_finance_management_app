export const useTransactions = (viewSelected) => {
  const { current, previous } = useSelectedTimePeriod(viewSelected);
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const transactions = ref([]);
  const previousTransactions = ref([]);
  const isLoading = ref(false);

  const income = computed(() => transactions.value.filter((t) => t.type_id === 1));
  const expense = computed(() => transactions.value.filter((t) => t.type_id === 2));
  const saving = computed(() => transactions.value.filter((t) => t.type_id === 3));
  const investment = computed(() => transactions.value.filter((t) => t.type_id === 4));

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);
  const savingCount = computed(() => saving.value.length);
  const investmentCount = computed(() => investment.value.length);

  const incomeTotal = computed(() => income.value.reduce((sum, transaction) => sum + transaction.amount, 0));
  const expenseTotal = computed(() => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0));
  const savingTotal = computed(() => saving.value.reduce((sum, transaction) => sum + transaction.amount, 0));
  const investmentTotal = computed(() => investment.value.reduce((sum, transaction) => sum + transaction.amount, 0));

  const priorIncomeTotal = computed(() => previousTransactions.value.filter((t) => t.type_id === 1).reduce((sum, transaction) => sum + transaction.amount, 0));
  const priorExpenseTotal = computed(() => previousTransactions.value.filter((t) => t.type_id === 2).reduce((sum, transaction) => sum + transaction.amount, 0));
  const priorSavingTotal = computed(() => previousTransactions.value.filter((t) => t.type_id === 3).reduce((sum, transaction) => sum + transaction.amount, 0));
  const priorInvestmentTotal = computed(() => previousTransactions.value.filter((t) => t.type_id === 4).reduce((sum, transaction) => sum + transaction.amount, 0));

  const fetchTransactions = async (timePeriod) => {
    isLoading.value = true;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          transactiontypes (name),
          categories (name)
        `)
        .eq('user_id', user.value.id)
        .gte('created_at', timePeriod.from.toISOString())
        .lte('created_at', timePeriod.to.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(transaction => ({
        ...transaction,
        type_name: transaction.transactiontypes.name,
        category_name: transaction.categories.name
      }));
    } finally {
      isLoading.value = false;
    }
  };

  const refresh = async () => {
    transactions.value = await fetchTransactions(current.value);
    previousTransactions.value = await fetchTransactions(previous.value);
  };

  watch(current, refresh);
  watch(previous, refresh);

  const transactionsGroupedByDate = computed(() => {
    let grouped = {};

    for (const transaction of transactions.value) {
      const date = transaction.created_at.split("T")[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(transaction);
    }

    const sortedKeys = Object.keys(grouped).sort().reverse();
    const sortedGrouped = {};

    for (const key of sortedKeys) {
      sortedGrouped[key] = grouped[key];
    }

    return sortedGrouped;
  });

  refresh();

  return {
    transactions,
    previousTransactions,
    isLoading,
    incomeCount,
    expenseCount,
    savingCount,
    investmentCount,
    incomeTotal,
    expenseTotal,
    savingTotal,
    investmentTotal,
    priorIncomeTotal,
    priorExpenseTotal,
    priorSavingTotal,
    priorInvestmentTotal,
    transactionsGroupedByDate,
    refresh,
    current,
    previous
  };
};
