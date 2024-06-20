export function useSharedState() {
  const user = useSupabaseUser();
  const viewSelected = ref(user.value?.user_metadata?.transaction_view || 'Monthly'); // Default to "Monthly"
  
  return {
    viewSelected,
  };
}
