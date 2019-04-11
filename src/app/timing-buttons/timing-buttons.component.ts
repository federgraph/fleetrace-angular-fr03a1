import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { TimingParams } from '../shared/test-data';
import { TBOManager } from '../../bo/bo-manager';
import { TEventRowCollectionItem } from '../../col/event/event-row-collection';
import { TRaceRowCollectionItem } from '../../col/race/race-row-collection-item';
import { IconData, EditbarIcons } from '../icon-legend/icon-data';

@Component({
    selector: 'app-timing-buttons',
    templateUrl: './timing-buttons.component.html',
    styleUrls: ['./timing-buttons.component.css']
})
export class TimingButtonsComponent implements OnInit {
    _ba: Array<number> = [];

    @Output() sendMsg: EventEmitter<string> = new EventEmitter();
    @Output() updateAll: EventEmitter<number> = new EventEmitter();
    @Output() calc: EventEmitter<number> = new EventEmitter();

    BowTupples: Array<[number, boolean]>;
    Bows: Array<number> = [];
    Bibs: Array<number> = [];

    autoShow: boolean = true;
    countShown: number = 0;

    CheckBarVisible = false;
    RadioBarVisible = true;
    PrepareBarVisible = false;
    WidgetVisible = false;
    EditVisible = false;
    InputLegendVisible = false;

    option = 0;

    options = [
        'time',
        'dns',
        'dnf',
        'dsq',
        'ok',
        'erase'
    ];

    InputMsgText1 = "";
    InputMsgText2 = "";

    editbarIcons: IconData[];

    constructor(public BOManager: TBOManager) {
        this.editbarIcons = IconData.readIconData(EditbarIcons);
    }

    ngOnInit() {
        this.BOManager.BO.updateStrictInputMode();
        this.update();
    }

    clickBiw(bow: number) {
        const t: TimingParams = {
            race: this.CurrentRace,
            tp: this.CurrentTP,
            bib: bow
        };

        this.onTimeCancelled(t);
    }

    clickBow(bow: number) {
        const t: TimingParams = {
            race: this.CurrentRace,
            tp: this.CurrentTP,
            bib: bow
        };

        this.onTimeReceived(t);

        let iob: number;
        if (this.BOManager.BO.Auto) {

            //bib and/or bow  may have already been removed (by timeReceived event)

            iob = this.Bibs.indexOf(bow);
            if (iob > -1)
                this.Bibs.splice(iob, 1);

            iob = this.Bows.indexOf(bow);
            if (iob > -1)
                this.Bows.splice(iob, 1);

            this.buildBowTupples();
            this.countShown = this.Bibs.length;
        }
    }

    hide() {
        this.autoShow = false;
        this.clear();
    }

    show() {
        this.autoShow = true;
        this.fill();
    }

    clear() {
        this.Bows = [];
        this.BowTupples = [];
    }

    fill() {
        this.Bows = this.Bibs.slice();
        this.buildBowTupples();
    }

    toggle() {
        if (this.Bows.length > 0)
            this.hide();
        else
            this.show();
    }

    update() {
        this.updateFromTimePoint();
        this.filterOutFinishedBibs();
        this.countShown = this.Bibs.length;
        if (this.autoShow)
            this.fill();
        else
            this.clear();
    }

    updateFromEvent() {
        const ba: Array<number> = [];

        const r = this.check_r(this.CurrentRace);

        const cl = this.BOManager.BO.EventNode.Collection.Items;
        let cr: TEventRowCollectionItem;
        for (let i = 0; i < cl.length; i++) {
            cr = cl[i];
            const bib = cr.Bib;
            const re = cr.Race[r];
            if (re.OTime === 0 && re.Penalty.IsOK) {
                ba.push(bib);
            }
        }

        this.Bibs = ba;
    }

    /**
     * if an existing event was loaded, which has no timing info for a time point in a race,
     * but finish position info in the event is present for that race,
     * these bibs (all) should not be available for race timing input,
     * since the entry has already completed that race or is Out.
     */
    filterOutFinishedBibs() {
        const ba: Array<number> = [];

        const r = this.check_r(this.CurrentRace);

        const cl = this.BOManager.BO.EventNode.Collection.Items;
        let cr: TEventRowCollectionItem;
        for (let i = 0; i < cl.length; i++) {
            cr = cl[i];
            const bib = cr.Bib;
            const re = cr.Race[r];
            if (re.OTime !== 0) {
                ba.push(bib);
            }
        }

        this.Bibs = this.Bibs.filter(function (el) {
            return ba.indexOf(el) < 0;
        });
    }

    updateFromTimePoint() {
        const ba: Array<number> = [];
        let r = this.CurrentRace;
        const t = this.CurrentTP;

        r = this.check_r(r);

        const cl = this.BOManager.BO.RNode[r].Collection.Items;
        let cr: TRaceRowCollectionItem;
        for (let i = 0; i < cl.length; i++) {
            cr = cl[i];
            const bib = cr.Bib;
            const tp = cr.IT[t];
            if (tp && !tp.OTime.TimePresent && cr.QU.IsOK) {
                ba.push(bib);
            }
        }

        this.Bibs = ba;
    }

    buildBowTupples() {
        let bt: [number, boolean];
        const bts: Array<[number, boolean]> = [];

        const l = this.BOManager.BO.BOParams.StartlistCount;

        for (let i = 1; i <= l; i++) {
            if (this.Bibs.includes(i))
                bt = [i, true];
            else
                bt = [i, false];
            bts.push(bt);
        }

        this.BowTupples = bts;
    }

    check_r(r: number): number {
        if (r > this.BOManager.BO.BOParams.RaceCount)
            r = this.BOManager.BO.BOParams.RaceCount;

        if (r >= this.BOManager.BO.RNode.length)
            r = this.BOManager.BO.BOParams.RaceCount;

        return r;
    }

    toggleChecks() {
        this.CheckBarVisible = !this.CheckBarVisible;
    }

    toggleRadios() {
        this.RadioBarVisible = !this.RadioBarVisible;
    }

    togglePrepareBar() {
        this.PrepareBarVisible = !this.PrepareBarVisible;
    }

    hideFabs() {
        this.hide();
    }

    toggleFabs() {
        this.toggle();
    }

    tryToggleStrict() {
        this.BOManager.BO.tryToggleStrict();
    }

    toggleWidget() {
        this.WidgetVisible = !this.WidgetVisible;
    }

    toggleEdit() {
        this.EditVisible = !this.EditVisible;
    }

    toggleUseQueue() {
        this.BOManager.BO.toggleUseQueue();
    }

    prepareSNR() {
        this.InputMsgText1 = `FR.*.W1.Pos${this.CurrentBib}.SNR=${1000 + this.CurrentBib}`;
        this.InputMsgText2 = '';
    }

    prepareBib() {
        this.InputMsgText1 = `FR.*.W1.Pos${this.CurrentBib}.Bib=${this.CurrentBib}`;
        this.InputMsgText2 = '';
    }

    prepareNC() {
        const cr = this.BOManager.BO.EventNode.FindBib(this.CurrentBib);
        const snr = cr.SNR;
        this.InputMsgText1 = `FR.*.SNR${snr}.NC=GER`;
        this.InputMsgText2 = '';
    }

    prepareRV() {
        this.InputMsgText1 = `FR.*.W${this.CurrentRace}.Bib${this.CurrentBib}.RV=500`;
        this.InputMsgText2 = '';
    }

    prepareQU() {
        this.InputMsgText2 = '';
        this.InputMsgText1 = `FR.*.W${this.CurrentRace}.Bib${this.CurrentBib}.QU=dnf`;
    }

    prepare$() {
        this.InputMsgText1 = `FR.*.W${this.CurrentRace}.Bib1.RV=$`;
        this.InputMsgText2 = '';
    }

    clearInput2() {
        this.InputMsgText2 = "";
    }

    onKeyTimeReceived(tm: TimingParams) {
        this.onTimeReceived(tm);
        this.update();
    }

    onTimeReceived(tm: TimingParams) {
        const time = this.getTimeString(2);

        let mt = 0;
        let qu = '';

        switch (this.option) {
            case 1: mt = 1; qu = 'dns'; break;
            case 2: mt = 2; qu = 'dnf'; break;
            case 3: mt = 3; qu = 'dsq'; break;
            case 4: mt = 4; qu = 'ok'; break;
        }

        const erase = this.option === 5;

        let te: string;
        let tr: string;
        if (mt > 0) {
            te = "";
            tr = "FR.*.W" + tm.race + ".Bib" + tm.bib + ".QU" + " = " + qu;
        }
        else if (erase) {
            te = "FR.*.W" + tm.race + ".Bib" + tm.bib + ".RV=0";
            tr = "FR.*.W" + tm.race + ".Bib" + tm.bib + ".IT" + tm.tp + " = -1";
        }
        else {
            te = "FR.*.W" + tm.race + ".Bib" + tm.bib + ".RV=500";
            tr = "FR.*.W" + tm.race + ".Bib" + tm.bib + ".IT" + tm.tp + " = " + time;
        }

        if (this.CurrentTP > 0)
            te = "";

        this.InputMsgText1 = tr;
        this.InputMsgText2 = te;
        this.CurrentBib = tm.bib;
        this.BOManager.BO.markBib();

        if (this.BOManager.BO.Auto) {
            if (this.BOManager.BO.UseQueue) {
                this.BOManager.BO.msgQueueR.push(tr);
                if (te !== "" && this.WantUpdateEvent) {
                    this.BOManager.BO.msgQueueE.push(te);
                }
            }
            else {
                this.BOManager.BO.Dispatch(tr);
                this.sendMsg.emit(tr);

                if (te !== "" && this.WantUpdateEvent) {
                    this.BOManager.BO.Dispatch(te);
                    this.sendMsg.emit(te);
                }

                this.calc.emit(0);
            }
        }

        this.option = 0;
    }

    onTimeCancelled(tm: TimingParams) {
        this.CurrentBib = tm.bib;
    }

    send1() {
        if (this.InputMsgText1 !== "") {
            const b1 = this.BOManager.BO.Dispatch(this.InputMsgText1);
            if (!b1)
                console.log('could not dispatch msg 1: ' + this.InputMsgText1);
            else
                this.sendMsg.emit(this.InputMsgText1);
        }
        if (this.InputMsgText2 !== "" && this.WantUpdateEvent) {
            const b2 = this.BOManager.BO.Dispatch(this.InputMsgText2);
            if (!b2)
                console.log('could not dispatch msg 2: ' + this.InputMsgText2);
            else
                this.sendMsg.emit(this.InputMsgText2);
        }
        this.updateAll.emit(0);
        this.update();
    }

    send2() {
        if (this.InputMsgText2 !== "" && this.WantUpdateEvent) {
            const b2 = this.BOManager.BO.Dispatch(this.InputMsgText2);
            if (!b2)
                console.log('could not dispatch msg 2: ' + this.InputMsgText2);
        }
        this.updateAll.emit(0);
        this.update();
    }

    generateMsg() {
        const t: TimingParams = {
            race: this.CurrentRace,
            tp: this.CurrentTP,
            bib: this.CurrentBib
        };
        this.onKeyTimeReceived(t);
    }

    /**
       * generate time string from new Date()
       * (duplicate) of similar method TRaceBO.getTime()
       * @returns string in format HH:mm:ss.fff
       */
    getTimeString(digits: number = 2) {
        const d = new Date();
        const hh = d.getHours();
        const mm = d.getMinutes();
        const ss = d.getSeconds();
        const t = d.getMilliseconds();

        const shh = "" + hh;
        const smm = mm < 10 ? "0" + mm : mm;
        const sss = ss < 10 ? "0" + ss : ss;
        let sms = "" + t;
        if (t < 10) { sms = "00" + t; }
        else if (t < 100) sms = "0" + t;

        switch (digits) {
            case 1: sms = sms.substring(0, 1); break;
            case 2: sms = sms.substring(0, 2); break;
        }

        const tm = shh + ':' + smm + ':' + sss + '.' + sms;
        return tm;
    }

    toggleInputLegend() {
        this.InputLegendVisible = !this.InputLegendVisible;
    }

    clearQueue() {
        this.BOManager.BO.msgQueueR = [];
        this.BOManager.BO.msgQueueE = [];
        this.update();
    }

    processQueue(calc: boolean = true) {
        let msg: string;
        while (this.BOManager.BO.msgQueueR.length > 0) {
            msg = this.BOManager.BO.msgQueueR.pop();
            this.BOManager.BO.Dispatch(msg);
            this.sendMsg.emit(msg);
        }

        while (this.BOManager.BO.msgQueueE.length > 0) {
            msg = this.BOManager.BO.msgQueueE.pop();
            if (msg !== "" && this.WantUpdateEvent) {
                this.BOManager.BO.Dispatch(msg);
                this.sendMsg.emit(msg);
            }
        }

        this.updateAll.emit(1);
    }

    showQueue() {
        this.updateAll.emit(2);
    }

    get QueueIsEmpty(): boolean {
        return this.BOManager.BO.msgQueueR.length === 0 && this.BOManager.BO.msgQueueE.length === 0;
    }

    get CurrentRace() {
        return this.BOManager.BO.CurrentRace;
    }

    set CurrentRace(value: number) {
        this.BOManager.BO.CurrentRace = value;
    }

    get CurrentTP() {
        return this.BOManager.BO.CurrentTP;
    }

    set CurrentTP(value: number) {
        this.BOManager.BO.CurrentTP = value;
    }

    get CurrentBib() {
        return this.BOManager.BO.CurrentBib;
    }

    set CurrentBib(value: number) {
        this.BOManager.BO.CurrentBib = value;
    }

    get Auto() {
        return this.BOManager.BO.Auto;
    }

    set Auto(value: boolean) {
        this.BOManager.BO.Auto = value;
    }

    get StrictInputMode() {
        return this.BOManager.BO.StrictInputMode;
    }

    set StrictInputmode(value: boolean) {
        this.BOManager.BO.StrictInputMode = value;
    }

    get WantUpdateEvent() {
        return this.BOManager.BO.WantUpdateEvent;
    }

    set WantUpdateEvent(value: boolean) {
        this.BOManager.BO.WantUpdateEvent = value;
    }

    get UseQueue() {
        return this.BOManager.BO.UseQueue;
    }

    set UseQueue(value: boolean) {
        this.BOManager.BO.UseQueue = value;
    }

    updateCurrent() {
        this.CurrentRace = this.CurrentRace;
        this.CurrentTP = this.CurrentTP;
        this.CurrentBib = this.CurrentBib;
    }

    get InputMsgText2Visible(): boolean {
        return this.CurrentTP === 0;
      }
    
}
