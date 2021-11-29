import { useCallback, useEffect, useState } from "react";
import {
  createNewSniper,
  deleteSniper,
  fetchAllSnipers,
  Sniper,
  updateSniper,
} from "./services/snipersRepository";

export const useSnipers = () => {
  const [snipers, setSnipers] = useState<Sniper[]>([]);

  useEffect(() => {
    fetchAllSnipers().then(setSnipers);
  }, [setSnipers]);

  const onNewSniper = useCallback(() => {
    createNewSniper();
    fetchAllSnipers().then(setSnipers);
  }, [setSnipers]);

  const onDeleteSniper = useCallback(
    (sniper) => {
      deleteSniper(sniper);
      fetchAllSnipers().then(setSnipers);
    },
    [setSnipers]
  );

  const onUpdateSniper = useCallback(
    (sniper, newAttributes) => {
      updateSniper(sniper, newAttributes);
      fetchAllSnipers().then(setSnipers);
    },
    [setSnipers]
  );

  return { snipers, onNewSniper, onDeleteSniper, onUpdateSniper };
};
