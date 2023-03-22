import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { WineListModel, WineList, WineListSnapshotOut } from "./WineList"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { api } from '../services/api/list-api';

export const WineListStoreModel = types
  .model("WineListStore")
  .props({
    wineLists: types.array(WineListModel),
    favorites: types.array(types.reference(WineListModel)),
    favoritesOnly: false,
    wineListsTotalRecord: types.optional(types.number, 0),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchWineLists() {
      const response = await api.getWineList()
      if (response.kind === "ok") {
        store.setProp("wineLists", response.wineLists)
      } else {
        console.tron.error(`Error fetching wineLists: ${JSON.stringify(response)}`, [])
      }
    },
    addFavorite(wineList: WineList) {
      store.favorites.push(wineList)
    },
    removeFavorite(wineList: WineList) {
      store.favorites.remove(wineList)
    },
    saveWineLists: (wineListSnapshots: WineListSnapshotOut[], totalCnt: number) => {
      store.wineLists.replace(store.wineLists.concat(...wineListSnapshots));
      store.wineListsTotalRecord = totalCnt;
    },
  }))
  .views((store) => ({
    get wineListsForList() {
      return store.favoritesOnly ? store.favorites : store.wineLists
    },

    hasFavorite(wineList: WineList) {
      return store.favorites.includes(wineList)
    },
  }))
  .actions((store) => ({
    toggleFavorite(wineList: WineList) {
      if (store.hasFavorite(wineList)) {
        store.removeFavorite(wineList)
      } else {
        store.addFavorite(wineList)
      }
    },
  }))

export interface WineListStore extends Instance<typeof WineListStoreModel> {}
export interface WineListStoreSnapshot extends SnapshotOut<typeof WineListStoreModel> {}

// @demo remove-file
