import { TFinish } from "./scoring-finish";
import { TEntry } from "./scoring-entry";
import { environment } from "../environments/environment";

export class TFinishList extends Array<TFinish> {

    constructor() {
        super();
        if (environment.wantES5)
            Object.setPrototypeOf(this, TFinishList.prototype);
    }

    /**
         * returns a finish if found, otherwise null
         */
    findEntry(e: TEntry): TFinish {
            if (this.length === 0)
                return null;

            let f: TFinish;
            for (let i = 0; i < this.length; i++) {
                f = this[i];
            if ((f.Entry != null) && (f.Entry.equals(e))) {
                    return f;
                }
            }
            return null;
        }

        Add(e: TFinish) {
            this.push(e);
        }

        Remove(e: TFinish) {
            const i = this.indexOf(e);
            if (i > -1)
                this.splice(i, 1);
        }

        AddAll(al: TFinishList) {
            for (let i = 0; i < al.length; i++)
                this.push(al[i]);
        }

        RemoveAll(al: TFinishList) {
            for (let i = 0; i < this.length; i++)
                this.Remove(al[i]);
        }

        Contains(obj: TFinish): boolean {
            return this.indexOf(obj) > -1;
        }

        Exchange(x: number, y: number) {
        if (this.length < 2)
                return;
            this.splice(y, 1, this.splice(x, 1, this[y])[0]);
        }

}
