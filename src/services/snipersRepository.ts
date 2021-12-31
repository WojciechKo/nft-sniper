import PouchDB from "pouchdb";

const SnipersDb = new PouchDB<Sniper | SniperAttributes>("snipers");

export class SniperAttributes {
  link: string = "";
  condition: string = "";
  floorPrice?: number;
}

export interface Sniper extends SniperAttributes {
  _id: string;
  _rev: string;
}

export const fetchAllSnipers = (): Promise<Sniper[]> => {
  return SnipersDb.allDocs({ include_docs: true })
    .then((response) => {
      const snipers = response.rows.map((row) => row.doc as Sniper);
      console.log("AllSnipers", snipers);
      return snipers;
    })
    .catch((err) => {
      console.log("Unable to fetch all snipers", err);
      return Promise.reject(err);
    });
};

export const createNewSniper = () => {
  SnipersDb.post(new SniperAttributes())
    .then((response) => {
      console.log("Created new sniper", response);
    })
    .catch((err) => {
      console.log("Unable to create new sniper");
      return Promise.reject(err);
    });
};

export const deleteSniper = (sniper: Sniper) => {
  SnipersDb.remove(sniper._id, sniper._rev)
    .then((response) => {
      console.log("Deleted sniper", response);
    })
    .catch((err) => {
      console.log("Unable to delete sniper", err);
      return Promise.reject(err);
    });
};

export const updateSniper = (sniper: Sniper, newSniper: SniperAttributes) => {
  SnipersDb.put({ ...sniper, ...newSniper })
    .then((response) => {
      console.log("Updated sniper", response);
    })
    .catch((err) => {
      console.log("Unable to delete sniper", err);
      return Promise.reject(err);
    });
};

export const updateFloorPrice = (sniper: Sniper, floorPrice: number) => {
  SnipersDb.put({ ...sniper, floorPrice })
    .then((response) => {
      console.log("Updated sniper", response);
    })
    .catch((err) => {
      console.log("Unable to delete sniper", err);
      return Promise.reject(err);
    });
};
