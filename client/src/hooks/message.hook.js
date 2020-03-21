import {useCallback} from "react";

export const useMessage = () => {
    return useCallback((text, colorStyle) => {
        if (window.M && text) {
            window.M.Toast.dismissAll()
            window.M.toast({html: text, classes: `rounded ${colorStyle} row`, displayLength: 5000})
        }
    }, [])
}