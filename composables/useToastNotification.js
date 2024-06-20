export const useToastNotification = () => {
    const toast = useToast() //function form NuxtUI UNotifications
    return {
        toastDone: ({ title, description = null }) => {
            toast.add({
                title: title,
                description,
                timeout: 3000,
                icon: "i-heroicons-check-circle",
                color: "green",
            })
        },
        toastError: ({ title, description = null }) => {
            toast.add({
                title: title,
                description,
                timeout: 3000,
                icon: "i-heroicons-exclamation-circle",
                color: "red",
            })
        }
    }
}