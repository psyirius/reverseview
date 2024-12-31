import { toast } from "@app/ui/Toaster";

export const Toast = {
    success(header, message) {
        toast(message, { type: "success", header });
    },
    info(header, message) {
        toast(message, { type: "info", header });
    },
    error(header, message) {
        toast(message, { type: "error", header });
    }
};
