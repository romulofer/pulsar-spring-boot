"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_languageclient_commons_1 = require("@pivotal-tools/atom-languageclient-commons");
const atom_languageclient_1 = require("atom-languageclient");
const BOOT_HINT_GUTTER_NAME = 'boot-hint-gutter';
const DECORATION_OPTIONS = {
    type: 'highlight',
    class: 'boot-hint',
    gutterName: BOOT_HINT_GUTTER_NAME
};
class BootStsAdapter extends atom_languageclient_commons_1.StsAdapter {
    constructor() {
        super();
        // Signature of the ranges last applied per editor, so repeated identical
        // highlight notifications (the running app polls and re-sends) do not tear
        // down and rebuild every marker on the render thread.
        this.lastRangeSignatures = new WeakMap();
    }
    onHighlight(params) {
        this.findEditors(params.doc.uri).forEach(editor => this.markHintsForEditor(editor, params.codeLenses));
    }
    markHintsForEditor(editor, codeLenses) {
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
    createHintMarker(editor, range) {
        // Create marker model
        const marker = editor.markBufferRange(atom_languageclient_1.Convert.lsRangeToAtomRange(range));
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
exports.BootStsAdapter = BootStsAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdC1zdHMtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9ib290LXN0cy1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEZBQXVGO0FBQ3ZGLDZEQUE0QztBQUk1QyxNQUFNLHFCQUFxQixHQUFHLGtCQUFrQixDQUFDO0FBRWpELE1BQU0sa0JBQWtCLEdBQXNCO0lBQzFDLElBQUksRUFBRSxXQUFXO0lBQ2pCLEtBQUssRUFBRSxXQUFXO0lBQ2xCLFVBQVUsRUFBRSxxQkFBcUI7Q0FDcEMsQ0FBQztBQUVGLG9CQUE0QixTQUFRLHdDQUFVO0lBTzFDO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFOWix5RUFBeUU7UUFDekUsMkVBQTJFO1FBQzNFLHNEQUFzRDtRQUM5Qyx3QkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBc0IsQ0FBQztJQUloRSxDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQXVCO1FBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzNHLENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxNQUFrQixFQUFFLFVBQXNCO1FBQ2pFLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMvRSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDcEQsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzlHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDOUQsK0RBQStEO1FBQy9ELGdCQUFnQjtRQUNoQix1Q0FBdUM7UUFDdkMseUJBQXlCO1FBQ3pCLHdDQUF3QztRQUN4Qyx5QkFBeUI7UUFDekIsUUFBUTtRQUNSLElBQUk7SUFDUixDQUFDO0lBRU8sZ0JBQWdCLENBQUMsTUFBa0IsRUFBRSxLQUFZO1FBQ3JELHNCQUFzQjtRQUN0QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLDZCQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUV6RSx1Q0FBdUM7UUFDdkMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUVsRCxrQ0FBa0M7UUFDbEMsNkRBQTZEO1FBQzdELGlCQUFpQjtRQUNqQixrQ0FBa0M7UUFDbEMsdUNBQXVDO1FBQ3ZDLDBCQUEwQjtRQUMxQixVQUFVO1FBQ1YsSUFBSTtRQUNKLHNEQUFzRDtRQUN0RCx5REFBeUQ7UUFDekQsc0RBQXNEO0lBQzFELENBQUM7Q0FFSjtBQXRERCx3Q0FzREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1N0c0FkYXB0ZXIsIEhpZ2hsaWdodFBhcmFtc30gZnJvbSAnQHBpdm90YWwtdG9vbHMvYXRvbS1sYW5ndWFnZWNsaWVudC1jb21tb25zJztcbmltcG9ydCB7Q29udmVydH0gZnJvbSAnYXRvbS1sYW5ndWFnZWNsaWVudCc7XG5pbXBvcnQgeyBSYW5nZSwgQ29kZUxlbnMgfSBmcm9tICd2c2NvZGUtbGFuZ3VhZ2VzZXJ2ZXItcHJvdG9jb2wnO1xuaW1wb3J0IHtUZXh0RWRpdG9yLCBEZWNvcmF0aW9uT3B0aW9ucyB9IGZyb20gJ2F0b20nO1xuXG5jb25zdCBCT09UX0hJTlRfR1VUVEVSX05BTUUgPSAnYm9vdC1oaW50LWd1dHRlcic7XG5cbmNvbnN0IERFQ09SQVRJT05fT1BUSU9OUzogRGVjb3JhdGlvbk9wdGlvbnMgPSB7XG4gICAgdHlwZTogJ2hpZ2hsaWdodCcsXG4gICAgY2xhc3M6ICdib290LWhpbnQnLFxuICAgIGd1dHRlck5hbWU6IEJPT1RfSElOVF9HVVRURVJfTkFNRVxufTtcblxuZXhwb3J0IGNsYXNzIEJvb3RTdHNBZGFwdGVyIGV4dGVuZHMgU3RzQWRhcHRlciB7XG5cbiAgICAvLyBTaWduYXR1cmUgb2YgdGhlIHJhbmdlcyBsYXN0IGFwcGxpZWQgcGVyIGVkaXRvciwgc28gcmVwZWF0ZWQgaWRlbnRpY2FsXG4gICAgLy8gaGlnaGxpZ2h0IG5vdGlmaWNhdGlvbnMgKHRoZSBydW5uaW5nIGFwcCBwb2xscyBhbmQgcmUtc2VuZHMpIGRvIG5vdCB0ZWFyXG4gICAgLy8gZG93biBhbmQgcmVidWlsZCBldmVyeSBtYXJrZXIgb24gdGhlIHJlbmRlciB0aHJlYWQuXG4gICAgcHJpdmF0ZSBsYXN0UmFuZ2VTaWduYXR1cmVzID0gbmV3IFdlYWtNYXA8VGV4dEVkaXRvciwgc3RyaW5nPigpO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgb25IaWdobGlnaHQocGFyYW1zOiBIaWdobGlnaHRQYXJhbXMpIHtcbiAgICAgICAgdGhpcy5maW5kRWRpdG9ycyhwYXJhbXMuZG9jLnVyaSkuZm9yRWFjaChlZGl0b3IgPT4gdGhpcy5tYXJrSGludHNGb3JFZGl0b3IoZWRpdG9yLCBwYXJhbXMuY29kZUxlbnNlcykpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWFya0hpbnRzRm9yRWRpdG9yKGVkaXRvcjogVGV4dEVkaXRvciwgY29kZUxlbnNlczogQ29kZUxlbnNbXSkge1xuICAgICAgICBjb25zdCByYW5nZXMgPSBBcnJheS5pc0FycmF5KGNvZGVMZW5zZXMpID8gY29kZUxlbnNlcy5tYXAoY2wgPT4gY2wucmFuZ2UpIDogW107XG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IEpTT04uc3RyaW5naWZ5KHJhbmdlcyk7XG4gICAgICAgIGlmICh0aGlzLmxhc3RSYW5nZVNpZ25hdHVyZXMuZ2V0KGVkaXRvcikgPT09IHNpZ25hdHVyZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdFJhbmdlU2lnbmF0dXJlcy5zZXQoZWRpdG9yLCBzaWduYXR1cmUpO1xuICAgICAgICBlZGl0b3IuZ2V0RGVjb3JhdGlvbnMoREVDT1JBVElPTl9PUFRJT05TKS5tYXAoZGVjb3JhdGlvbiA9PiBkZWNvcmF0aW9uLmdldE1hcmtlcigpKS5mb3JFYWNoKG0gPT4gbS5kZXN0cm95KCkpO1xuICAgICAgICByYW5nZXMuZm9yRWFjaChyYW5nZSA9PiB0aGlzLmNyZWF0ZUhpbnRNYXJrZXIoZWRpdG9yLCByYW5nZSkpO1xuICAgICAgICAvLyBjb25zdCBndXR0ZXIgPSBlZGl0b3IuZ3V0dGVyV2l0aE5hbWUoQk9PVF9ISU5UX0dVVFRFUl9OQU1FKTtcbiAgICAgICAgLy8gaWYgKGd1dHRlcikge1xuICAgICAgICAvLyAgICAgaWYgKCFyYW5nZXMgfHwgIXJhbmdlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gICAgICAgICBndXR0ZXIuaGlkZSgpO1xuICAgICAgICAvLyAgICAgfSBlbHNlIGlmICghZ3V0dGVyLmlzVmlzaWJsZSgpKSB7XG4gICAgICAgIC8vICAgICAgICAgZ3V0dGVyLnNob3coKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlSGludE1hcmtlcihlZGl0b3I6IFRleHRFZGl0b3IsIHJhbmdlOiBSYW5nZSkge1xuICAgICAgICAvLyBDcmVhdGUgbWFya2VyIG1vZGVsXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoQ29udmVydC5sc1JhbmdlVG9BdG9tUmFuZ2UocmFuZ2UpKTtcblxuICAgICAgICAvLyBNYXJrZXIgYXJvdW5kIHRoZSB0ZXh0IGluIHRoZSBlZGl0b3JcbiAgICAgICAgZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwgREVDT1JBVElPTl9PUFRJT05TKTtcblxuICAgICAgICAvLyBNYXJrZXIgaW4gdGhlIGRpYWdub3N0aWMgZ3V0dGVyXG4gICAgICAgIC8vIGxldCBndXR0ZXIgPSBlZGl0b3IuZ3V0dGVyV2l0aE5hbWUoQk9PVF9ISU5UX0dVVFRFUl9OQU1FKTtcbiAgICAgICAgLy8gaWYgKCFndXR0ZXIpIHtcbiAgICAgICAgLy8gICAgIGd1dHRlciA9IGVkaXRvci5hZGRHdXR0ZXIoe1xuICAgICAgICAvLyAgICAgICAgIG5hbWU6IEJPT1RfSElOVF9HVVRURVJfTkFNRSxcbiAgICAgICAgLy8gICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGNvbnN0IGljb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAvLyBpY29uRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2d1dHRlci1ib290LWhpbnQnKTtcbiAgICAgICAgLy8gZ3V0dGVyLmRlY29yYXRlTWFya2VyKG1hcmtlciwge2l0ZW06IGljb25FbGVtZW50fSk7XG4gICAgfVxuXG59Il19