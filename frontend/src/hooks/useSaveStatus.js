import { useCallback, useRef, useState } from "react";

export const useSaveStatus = () => {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  const clearSavedLater = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 1800);
  };

  const runSave = useCallback(async (fn) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("saving");
    setMessage("Guardando cambios...");
    try {
      const result = await fn();
      setStatus("saved");
      setMessage("Cambios guardados");
      clearSavedLater();
      return result;
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("No se pudieron guardar los cambios");
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");
    setMessage("");
  }, []);

  return { status, message, runSave, reset };
};
