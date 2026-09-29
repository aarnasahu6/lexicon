import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Store,
  ProfileSchema,
  ConceptSchema,
  ResultSchema,
} from "../data/types";
import { z } from "zod";
const schema = z.object({
  profile: ProfileSchema.nullable(),
  saved: z.array(
    ConceptSchema.extend({
      id: z.string(),
      learned: z.boolean(),
      created_at: z.string(),
    }),
  ),
  history: z.array(
    z.object({
      id: z.string(),
      action_type: z.enum(["bridge", "understand"]),
      input_text: z.string(),
      output: ResultSchema,
      created_at: z.string(),
    }),
  ),
});
export const emptyStore: Store = { profile: null, saved: [], history: [] };
// Replace this interface with a SQLite adapter when downloadable packs are introduced.
export interface LocalRepository {
  load(): Promise<Store>;
  save(data: Store): Promise<void>;
}
export const localRepository: LocalRepository = {
  async load() {
    const raw = await AsyncStorage.getItem("lexicon:v1");
    return raw ? schema.parse(JSON.parse(raw)) : emptyStore;
  },
  async save(data) {
    await AsyncStorage.setItem("lexicon:v1", JSON.stringify(data));
  },
};
