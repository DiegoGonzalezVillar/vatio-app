import { useEffect, useMemo, useState } from "react";

export const useSimpleObraTable = ({ obraId, fetcher, saver, emptyRow = {} }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargar = async () => {
    if (!obraId) return;
    setLoading(true);
    try {
      setItems(await fetcher(obraId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [obraId]);

  const guardar = async (row) => {
    const saved = await saver({ ...emptyRow, ...row, obra_id: obraId });
    setItems((prev) => {
      const rest = prev.filter((i) => !(i.id && saved.id && i.id === saved.id));
      return [saved, ...rest];
    });
    return saved;
  };

  const total = useMemo(() => items.reduce((acc, item) => acc + Number(item.subtotal || item.total || 0), 0), [items]);
  return { items, setItems, loading, cargar, guardar, total };
};
