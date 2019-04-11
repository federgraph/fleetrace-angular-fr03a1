import { Component, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { TimingService } from '../shared/timing.service';
import { ApiService } from '../shared/api.service';

enum AmpelColor {
    white,
    red,
    yellow,
    green,
    gray
}

@Component({
    selector: 'app-connection-control',
    templateUrl: './connection-control.component.html',
    styleUrls: ['./connection-control.component.css']
})
export class ConnectionControlComponent implements OnDestroy {

    @Input() wantInput: boolean = true;
    @Input() wantOutput: boolean = true;

    @Input() mode: number = 1;
    @Output() newNettoAvailable: EventEmitter<string> = new EventEmitter();

    @Input() race: number = 1;
    @Input() timepoint: number = 0;

    isDropping = true;

    canWatch = false;
    private subscription: Subscription;
    isWatching: boolean = false;
    netto: string = "";

    private inputConnected = false;
    private outputConnected = false;
    ledIn: AmpelColor = AmpelColor.white;
    ledOut: AmpelColor = AmpelColor.white;
    ledColorIn = "red";
    ledColorOut = "red";

    dataMsgIn = "";
    dataMsgOut = "";
    errorMsg = "";
    flashMsg = "";

    constructor(
        private timingService: TimingService,
        private apiService: ApiService) {
        this.updateLEDColor();
    }

    ngOnDestroy(): any {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    writeInputNetto(nettoText: string) {
        this.dataMsgIn = nettoText.length.toString();
    }

    writeOutputNetto(nettoText: string) {
        this.dataMsgOut = nettoText;
    }

    onWebsocketMsgReceived(nettoText: string) {
        if (!this.isDropping)
            this.newNettoAvailable.emit(nettoText);
    }

    handleError(err: any) {
        this.setInputConnected(false);
        this.setOutputConnected(false);
        this.errorMsg = `status: ${err.status} url: ${err.url}`;
    }

    updateFlash(s: string) {
        this.flashMsg = s;
        this.dataMsgIn = "";
        this.dataMsgOut = "";
        this.errorMsg = "";
    }

    connectBtnClick() {
        this.connectInput();
        this.connectOutput();
        this.updateFlash('connecting to both input and output');
    }

    connectInput() {
        this.ledIn = AmpelColor.white;
        this.updateFlash('connect input');
        this.apiService.inputWireConnect().subscribe(
            (data) => {
                this.dataMsgIn = data;
                this.ledIn = AmpelColor.yellow;
                this.setInputConnected(true);
            },
            (err) => {
                this.handleError(err);
                this.dataMsgIn = "";
                this.ledIn = AmpelColor.gray;
                this.setInputConnected(false);
            }
        );        
    }

    connectOutput() {
        this.ledOut = AmpelColor.white;
        this.updateFlash('connect output');        
        this.apiService.outputWireConnect().subscribe(
            (data) => {
                this.dataMsgOut = data;
                this.ledOut = AmpelColor.yellow;
                this.setOutputConnected(true);
            },
            (err) => {
                this.handleError(err);
                this.dataMsgOut = "";
                this.ledOut = AmpelColor.gray;
                this.setOutputConnected(false);
            }
        );
    }

    disconnectBtnClick() {
        this.disconnectInput();
        this.disconnectOutput();
        this.updateFlash('disconnecting from both input and output');
    }

    disconnectInput() {
        this.ledIn = AmpelColor.white;
        this.updateFlash('disconnecting from input');
        this.apiService.inputWireDisconnect().subscribe(
            (data) => {
                this.dataMsgIn = data;
                this.ledIn = AmpelColor.red;
                this.setInputConnected(false);
            },
            (err) => {
                this.handleError(err);
                this.dataMsgIn = "";
                this.ledIn = AmpelColor.gray;
                this.setInputConnected(false);
            }
        );
    }

    disconnectOutput() {
        this.ledOut = AmpelColor.white;
        this.updateFlash('disconnecting from output');
        this.apiService.outputWireDisconnect().subscribe(
            (data) => {
                this.dataMsgOut = data;
                this.ledOut = AmpelColor.red;
                this.setOutputConnected(false);
            },
            (err) => {
                this.handleError(err);
                this.dataMsgOut = "";
                this.ledOut = AmpelColor.gray;
                this.setOutputConnected(false);
            }
        );
    }

    clearBtnClick() {
        this.updateFlash('clear');
        this.apiService.manageClear().subscribe(
            (res) => {
                if (res)
                    this.dataMsgIn = res;
                else
                    this.dataMsgIn = 'please check response for clear';
            },
            err => this.handleError(err)
        );
    }

    inputNettoClick() {
        this.updateFlash('input netto requested');
        this.dataMsgIn = "";
        switch (this.mode) {

            case 0:
                this.apiService.getNarrowRaceTableJson(this.race, this.timepoint).subscribe(
                    data => this.writeInputNetto(data),
                    err => this.handleError(err)
                );
                break;

            case 1:
                this.apiService.getWideRaceTableJson(this.race, this.timepoint).subscribe(
                    data => this.writeInputNetto(data),
                    err => this.handleError(err)
                );
                break;

            case 2:
                this.apiService.getFinishTableJson().subscribe(
                    data => this.writeInputNetto(data),
                    err => this.handleError(err)
                );
                break;

            case 3:
                this.apiService.getPointsTableJson().subscribe(
                    data => this.writeInputNetto(data),
                    err => this.handleError(err)
                );
                break;

            default:
                break;

        }
    }

    outputNettoClick() {
        this.updateFlash('output netto requested (last msg)');
        this.dataMsgOut = "";
        this.apiService.requestOutputNetto().subscribe(
            data => this.writeOutputNetto(data),
            err => this.handleError(err)
        );
    }

    testInput() {
        this.updateFlash('testing input');
        this.apiService.getConnectionStatus().subscribe(
            (data) => {
                if (data.connected) {
                    this.dataMsgIn = "input connected";
                    this.ledIn = AmpelColor.green;
                    this.setInputConnected(true);
                }
                else {
                    this.dataMsgIn = "input not connected";
                    this.ledIn = AmpelColor.red;
                    this.setInputConnected(false);
                }

                if (data.websockets) {
                    this.canWatch = true;
                }
                else {
                    this.canWatch = false;
                }
            },
            (err) => this.handleError(err)
        );
    }

    testOutput() {
        this.updateFlash('testing output');
        this.apiService.getOpuputConnectionStatus().subscribe(
            (data) => {
                if (data.connected) {
                    this.dataMsgOut = "output connected";
                    this.ledOut = AmpelColor.green;
                    this.setOutputConnected(true);
                }
                else {
                    this.dataMsgOut = "output not connected";
                    this.ledOut = AmpelColor.red;
                    this.setOutputConnected(false);
                }

                if (data.websockets) {
                    this.canWatch = true;
                }
                else {
                    this.canWatch = false;
                }
            },
            (err) => this.handleError(err)
        );
    }

    toggleWatchNetto() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
            this.isWatching = false;
        } else {
            this.isWatching = true;
            this.subscription = this.timingService.watchRace(-1)
                .subscribe(
                    message => {
                        this.netto = message.netto;
                        this.onWebsocketMsgReceived(this.netto);
                    },
                    error => console.log(error));
        }
    }

    updateLEDColor(): void {
        this.updateLEDColorInput();
        this.updateLEDColorOutput();
    }

    updateLEDColorInput(): void {
        switch (this.ledIn) {
            case AmpelColor.white: this.ledColorIn = "white"; break;
            case AmpelColor.red: this.ledColorIn = "red"; break;
            case AmpelColor.yellow: this.ledColorIn = "yellow"; break;
            case AmpelColor.green: this.ledColorIn = "lime"; break;
            default: this.ledColorIn = "gray"; break;
        }
    }

    updateLEDColorOutput(): void {
        switch (this.ledOut) {
            case AmpelColor.white: this.ledColorOut = "white"; break;
            case AmpelColor.red: this.ledColorOut = "red"; break;
            case AmpelColor.yellow: this.ledColorOut= "yellow"; break;
            case AmpelColor.green: this.ledColorOut = "lime"; break;
            default: this.ledColorOut = "gray"; break;
        }        
    }

    getInputConnected(): boolean {
        return this.inputConnected;
    }

    setInputConnected(value: boolean) {
        this.inputConnected = value;
        this.updateLEDColor();
    }

    getOutputConnected(): boolean {
        return this.outputConnected;
    }

    setOutputConnected(value: boolean) {
        this.outputConnected = value;
        this.updateLEDColor();
    }

    sendMsg(msg: string) {
        if (this.subscription) {
            //use open websocket channel
            this.timingService.send(-2, msg);
        }
        else {
            //use ajax
            if (this.inputConnected)
                this.apiService.sendMsg(msg).subscribe(
                    data => this.writeUpdate(data),
                    err => console.log("Cannot retrieve response. Error code: %s, URL: %s ", err.status, err.url)
                );
        }
    }

    writeUpdate(responseText: string) {
        const div = document.getElementById("response-text");
        if (div != null)
            div.innerHTML = responseText;
    }

    toggleDropping() {
        this.isDropping = ! this.isDropping;
    }

}
