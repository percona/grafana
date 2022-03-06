import { StoreState } from 'app/types';

export const getPerconaSettings = (state: StoreState) => state.perconaSettings;
export const getPerconaUser = (state: StoreState) => state.perconaUser;
export const getKubernetes = (state: StoreState) => state.perconaKubernetes;
export const getDeleteKubernetes = (state: StoreState) => state.deletePerconaKubernetes;
export const getAddKubernetes = (state: StoreState) => state.addPerconaKubernetes;
