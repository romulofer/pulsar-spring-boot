import { StsAdapter, HighlightParams } from '@pivotal-tools/atom-languageclient-commons';
export declare class BootStsAdapter extends StsAdapter {
    private lastRangeSignatures;
    constructor();
    onHighlight(params: HighlightParams): void;
    private markHintsForEditor;
    private createHintMarker;
}
