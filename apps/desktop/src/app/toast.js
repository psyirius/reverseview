import { toast } from "@app/ui/Toaster";

export const Toast = {
    success(header, message) {
        toast(message, { type: "success", header, duration: 5000 });
    },
    info(header, message) {
        toast(message, { type: "info", header, duration: 5000 });
    },
    error(header, message) {
        toast(message, { type: "error", header, duration: 5000 });
    }
};
