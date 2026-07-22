import {StsAdapter, HighlightParams} from '@pivotal-tools/atom-languageclient-commons';
import {Convert} from 'atom-languageclient';
import { Range, CodeLens } from 'vscode-languageserver-protocol';
import {TextEditor, DecorationOptions } from 'atom';

const BOOT_HINT_GUTTER_NAME = 'boot-hint-gutter';

const DECORATION_OPTIONS: DecorationOptions = {
    type: 'highlight',
    class: 'boot-hint',
    gutterName: BOOT_HINT_GUTTER_NAME
};

export class BootStsAdapter extends StsAdapter {

    // Signature of the ranges last applied per editor, so repeated identical
    // highlight notifications (the running app polls and re-sends) do not tear
    // down and rebuild every marker on the render thread.
    private lastRangeSignatures = new WeakMap<TextEditor, string>();

    constructor() {
        super();
    }

    onHighlight(params: HighlightParams) {
        this.findEditors(params.doc.uri).forEach(editor => this.markHintsForEditor(editor, params.codeLenses));
    }

    private markHintsForEditor(editor: TextEditor, codeLenses: CodeLens[]) {
        const ranges = Array.isArray(codeLenses) ? codeLenses.map(cl => cl.range) : [];
        const signature = JSON.stringify(ranges);
        if (this.lastRangeSignatures.get(editor) === signature) {
            return;
        }
        this.lastRangeSignatures.set(editor, signature);
        editor.getDecorations(DECORATION_OPTIONS).map(decoration => decoration.getMarker()).forEach(m => m.destroy());
        ranges.forEach(range => this.createHintMarker(editor, range));
        // const gutter = editor.gutterWithName(BOOT_HINT_GUTTER_NAME);
        // if (gutter) {
        //     if (!ranges || !ranges.length) {
        //         gutter.hide();
        //     } else if (!gutter.isVisible()) {
        //         gutter.show();
        //     }
        // }
    }

    private createHintMarker(editor: TextEditor, range: Range) {
        // Create marker model
        const marker = editor.markBufferRange(Convert.lsRangeToAtomRange(range));

        // Marker around the text in the editor
        editor.decorateMarker(marker, DECORATION_OPTIONS);

        // Marker in the diagnostic gutter
        // let gutter = editor.gutterWithName(BOOT_HINT_GUTTER_NAME);
        // if (!gutter) {
        //     gutter = editor.addGutter({
        //         name: BOOT_HINT_GUTTER_NAME,
        //         visible: false,
        //     });
        // }
        // const iconElement = document.createElement('span');
        // iconElement.setAttribute('class', 'gutter-boot-hint');
        // gutter.decorateMarker(marker, {item: iconElement});
    }

}