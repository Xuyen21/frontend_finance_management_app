// default redirect to the homepage
export const useRedirecting = (url = '/') => {
    const user = useSupabaseUser();
    watch(
        user,
        (user) => {
            // give alert if user successfully signed in
            if (user) {
                return navigateTo(url) //function of Nuxt3
            }
        },
        { immediate: true }
    );
    return { user }
}