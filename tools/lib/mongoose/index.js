import mongoose from "./connect";

mongoose.Promise = global.Promise;

export default mongoose;
export User from "./user";
export Staff from "./staff";