"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const atom_languageclient_commons_1 = require("@pivotal-tools/atom-languageclient-commons");
const boot_sts_adapter_1 = require("./boot-sts-adapter");
class SpringBootLanguageClient extends atom_languageclient_commons_1.JavaProcessLanguageClient {
    constructor() {
        //noinspection JSAnnotator
        const overrideJar = atom.config.get('spring-boot.serverJar');
        if (typeof overrideJar === 'string' && overrideJar.length > 0) {
            super(path.dirname(overrideJar), path.basename(overrideJar));
        }
        else {
            super(path.join(__dirname, '..', 'server'), 'spring-boot-language-server.jar');
        }
        // this.DEBUG = true;
    }
    postInitialization(server) {
        super.postInitialization(server);
        this.sendConfig(server);
        this._disposable.add(atom.config.observe('spring-boot', () => this.sendConfig(server)));
    }
    sendConfig(server) {
        server.connection.didChangeConfiguration({ settings: { 'boot-java': atom.config.get('spring-boot') } });
    }
    getGrammarScopes() {
        return ['source.java', 'source.boot-properties', 'source.boot-properties-yaml', 'text.xml'];
    }
    getLanguageName() {
        return 'spring-boot';
    }
    getServerName() {
        return 'Spring Boot';
    }
    activate() {
        require('atom-package-deps')
            .install('pulsar-spring-boot')
            .then(() => console.debug('All dependencies installed, good to go'));
        super.activate();
    }
    preferJdk() {
        return true;
    }
    launchVmArgs(jvm) {
        let vmargs = [
            // '-Xdebug',
            // '-agentlib:jdwp=transport=dt_socket,server=y,address=7999,suspend=y',
            '-Dorg.slf4j.simpleLogger.logFile=boot-java.log'
        ];
        if (!jvm.isJdk()) {
            this.showErrorMessage('Spring Boot Language Support Limited', 'JAVA_HOME or PATH points to a JRE. The Spring Boot Language Server needs a JDK (Java 17 or newer); Boot live hints are unavailable until one is configured.');
        }
        return Promise.resolve(vmargs);
    }
    provideDefinitions() {
        // atom-ide-definitions picks a single highest-priority provider per
        // editor, not a merge. The Spring Boot Language Server only resolves
        // Spring specific symbols, so at the default priority it would shadow
        // ide-java-pulsar (JDT) and break Java go-to-definition. Drop below
        // JDT's priority of 20; this provider still wins on the boot-properties
        // grammars, where no other provider registers.
        const provider = super.provideDefinitions();
        provider.priority = 1;
        return provider;
    }
    createStsAdapter() {
        return new boot_sts_adapter_1.BootStsAdapter();
    }
    filterChangeWatchedFiles(filePath) {
        return filePath.endsWith('.gradle') || filePath.endsWith(path.join('', 'pom.xml'));
    }
    getJavaOptions() {
        const home = atom.config.get('spring-boot.java.home');
        const vmargs = atom.config.get('spring-boot.java.vmargs');
        return {
            home: typeof home === 'string' ? home : undefined,
            vmargs: Array.isArray(vmargs) ? vmargs : undefined
        };
    }
}
exports.SpringBootLanguageClient = SpringBootLanguageClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ByaW5nLWJvb3QtbGFuZ3VhZ2UtY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3NwcmluZy1ib290LWxhbmd1YWdlLWNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qiw0RkFBa0c7QUFDbEcseURBQWtEO0FBSWxELDhCQUFzQyxTQUFRLHVEQUF5QjtJQUVuRTtRQUNJLDBCQUEwQjtRQUMxQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzdELElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztTQUNoRTthQUFNO1lBQ0gsS0FBSyxDQUNELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsRUFDcEMsaUNBQWlDLENBQ3BDLENBQUM7U0FDTDtRQUNELHFCQUFxQjtJQUN6QixDQUFDO0lBRVMsa0JBQWtCLENBQUMsTUFBb0I7UUFDN0MsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEIsSUFBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFTyxVQUFVLENBQUMsTUFBb0I7UUFDbkMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztJQUMxRyxDQUFDO0lBRUQsZ0JBQWdCO1FBQ1osT0FBTyxDQUFDLGFBQWEsRUFBRSx3QkFBd0IsRUFBRSw2QkFBNkIsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsZUFBZTtRQUNYLE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxhQUFhO1FBQ1QsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsbUJBQW1CLENBQUM7YUFDdkIsT0FBTyxDQUFDLG9CQUFvQixDQUFDO2FBQzdCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQztRQUN6RSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsWUFBWSxDQUFDLEdBQVE7UUFDakIsSUFBSSxNQUFNLEdBQUc7WUFDVCxhQUFhO1lBQ2Isd0VBQXdFO1lBQ3hFLGdEQUFnRDtTQUNuRCxDQUFDO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNkLElBQUksQ0FBQyxnQkFBZ0IsQ0FDakIsc0NBQXNDLEVBQ3RDLDZKQUE2SixDQUNoSyxDQUFDO1NBQ0w7UUFDRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELGtCQUFrQjtRQUNkLG9FQUFvRTtRQUNwRSxxRUFBcUU7UUFDckUsc0VBQXNFO1FBQ3RFLG9FQUFvRTtRQUNwRSx3RUFBd0U7UUFDeEUsK0NBQStDO1FBQy9DLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzVDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxnQkFBZ0I7UUFDWixPQUFPLElBQUksaUNBQWMsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCx3QkFBd0IsQ0FBQyxRQUFnQjtRQUNyQyxPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxjQUFjO1FBQ1YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN0RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzFELE9BQU87WUFDSCxJQUFJLEVBQUUsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDakQsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUUsU0FBUztTQUN0RCxDQUFDO0lBQ04sQ0FBQztDQUVKO0FBN0ZELDREQTZGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge0phdmFQcm9jZXNzTGFuZ3VhZ2VDbGllbnQsIEphdmFPcHRpb25zfSBmcm9tICdAcGl2b3RhbC10b29scy9hdG9tLWxhbmd1YWdlY2xpZW50LWNvbW1vbnMnO1xuaW1wb3J0IHtCb290U3RzQWRhcHRlcn0gZnJvbSAnLi9ib290LXN0cy1hZGFwdGVyJztcbmltcG9ydCB7QWN0aXZlU2VydmVyfSBmcm9tICdhdG9tLWxhbmd1YWdlY2xpZW50JztcbmltcG9ydCB7SlZNfSBmcm9tICdAcGl2b3RhbC10b29scy9qdm0tbGF1bmNoLXV0aWxzJztcblxuZXhwb3J0IGNsYXNzIFNwcmluZ0Jvb3RMYW5ndWFnZUNsaWVudCBleHRlbmRzIEphdmFQcm9jZXNzTGFuZ3VhZ2VDbGllbnQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTQW5ub3RhdG9yXG4gICAgICAgIGNvbnN0IG92ZXJyaWRlSmFyID0gYXRvbS5jb25maWcuZ2V0KCdzcHJpbmctYm9vdC5zZXJ2ZXJKYXInKTtcbiAgICAgICAgaWYgKHR5cGVvZiBvdmVycmlkZUphciA9PT0gJ3N0cmluZycgJiYgb3ZlcnJpZGVKYXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3VwZXIocGF0aC5kaXJuYW1lKG92ZXJyaWRlSmFyKSwgcGF0aC5iYXNlbmFtZShvdmVycmlkZUphcikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIoXG4gICAgICAgICAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3NlcnZlcicpLFxuICAgICAgICAgICAgICAgICdzcHJpbmctYm9vdC1sYW5ndWFnZS1zZXJ2ZXIuamFyJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLkRFQlVHID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcG9zdEluaXRpYWxpemF0aW9uKHNlcnZlcjogQWN0aXZlU2VydmVyKSB7XG4gICAgICAgIHN1cGVyLnBvc3RJbml0aWFsaXphdGlvbihzZXJ2ZXIpO1xuICAgICAgICB0aGlzLnNlbmRDb25maWcoc2VydmVyKTtcbiAgICAgICAgKDxhbnk+dGhpcykuX2Rpc3Bvc2FibGUuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ3NwcmluZy1ib290JywgKCkgPT4gdGhpcy5zZW5kQ29uZmlnKHNlcnZlcikpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlbmRDb25maWcoc2VydmVyOiBBY3RpdmVTZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLmNvbm5lY3Rpb24uZGlkQ2hhbmdlQ29uZmlndXJhdGlvbih7IHNldHRpbmdzOiB7J2Jvb3QtamF2YSc6IGF0b20uY29uZmlnLmdldCgnc3ByaW5nLWJvb3QnKSB9fSk7XG4gICAgfVxuXG4gICAgZ2V0R3JhbW1hclNjb3BlcygpIHtcbiAgICAgICAgcmV0dXJuIFsnc291cmNlLmphdmEnLCAnc291cmNlLmJvb3QtcHJvcGVydGllcycsICdzb3VyY2UuYm9vdC1wcm9wZXJ0aWVzLXlhbWwnLCAndGV4dC54bWwnXTtcbiAgICB9XG5cbiAgICBnZXRMYW5ndWFnZU5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnc3ByaW5nLWJvb3QnO1xuICAgIH1cblxuICAgIGdldFNlcnZlck5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnU3ByaW5nIEJvb3QnO1xuICAgIH1cblxuICAgIGFjdGl2YXRlKCkge1xuICAgICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpXG4gICAgICAgICAgICAuaW5zdGFsbCgncHVsc2FyLXNwcmluZy1ib290JylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGNvbnNvbGUuZGVidWcoJ0FsbCBkZXBlbmRlbmNpZXMgaW5zdGFsbGVkLCBnb29kIHRvIGdvJykpO1xuICAgICAgICBzdXBlci5hY3RpdmF0ZSgpO1xuICAgIH1cblxuICAgIHByZWZlckpkaygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGF1bmNoVm1BcmdzKGp2bTogSlZNKSB7XG4gICAgICAgIGxldCB2bWFyZ3MgPSBbXG4gICAgICAgICAgICAvLyAnLVhkZWJ1ZycsXG4gICAgICAgICAgICAvLyAnLWFnZW50bGliOmpkd3A9dHJhbnNwb3J0PWR0X3NvY2tldCxzZXJ2ZXI9eSxhZGRyZXNzPTc5OTksc3VzcGVuZD15JyxcbiAgICAgICAgICAgICctRG9yZy5zbGY0ai5zaW1wbGVMb2dnZXIubG9nRmlsZT1ib290LWphdmEubG9nJ1xuICAgICAgICBdO1xuICAgICAgICBpZiAoIWp2bS5pc0pkaygpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dFcnJvck1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgJ1NwcmluZyBCb290IExhbmd1YWdlIFN1cHBvcnQgTGltaXRlZCcsXG4gICAgICAgICAgICAgICAgJ0pBVkFfSE9NRSBvciBQQVRIIHBvaW50cyB0byBhIEpSRS4gVGhlIFNwcmluZyBCb290IExhbmd1YWdlIFNlcnZlciBuZWVkcyBhIEpESyAoSmF2YSAxNyBvciBuZXdlcik7IEJvb3QgbGl2ZSBoaW50cyBhcmUgdW5hdmFpbGFibGUgdW50aWwgb25lIGlzIGNvbmZpZ3VyZWQuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZtYXJncyk7XG4gICAgfVxuXG4gICAgcHJvdmlkZURlZmluaXRpb25zKCkge1xuICAgICAgICAvLyBhdG9tLWlkZS1kZWZpbml0aW9ucyBwaWNrcyBhIHNpbmdsZSBoaWdoZXN0LXByaW9yaXR5IHByb3ZpZGVyIHBlclxuICAgICAgICAvLyBlZGl0b3IsIG5vdCBhIG1lcmdlLiBUaGUgU3ByaW5nIEJvb3QgTGFuZ3VhZ2UgU2VydmVyIG9ubHkgcmVzb2x2ZXNcbiAgICAgICAgLy8gU3ByaW5nIHNwZWNpZmljIHN5bWJvbHMsIHNvIGF0IHRoZSBkZWZhdWx0IHByaW9yaXR5IGl0IHdvdWxkIHNoYWRvd1xuICAgICAgICAvLyBpZGUtamF2YS1wdWxzYXIgKEpEVCkgYW5kIGJyZWFrIEphdmEgZ28tdG8tZGVmaW5pdGlvbi4gRHJvcCBiZWxvd1xuICAgICAgICAvLyBKRFQncyBwcmlvcml0eSBvZiAyMDsgdGhpcyBwcm92aWRlciBzdGlsbCB3aW5zIG9uIHRoZSBib290LXByb3BlcnRpZXNcbiAgICAgICAgLy8gZ3JhbW1hcnMsIHdoZXJlIG5vIG90aGVyIHByb3ZpZGVyIHJlZ2lzdGVycy5cbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBzdXBlci5wcm92aWRlRGVmaW5pdGlvbnMoKTtcbiAgICAgICAgcHJvdmlkZXIucHJpb3JpdHkgPSAxO1xuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XG4gICAgfVxuXG4gICAgY3JlYXRlU3RzQWRhcHRlcigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb290U3RzQWRhcHRlcigpO1xuICAgIH1cblxuICAgIGZpbHRlckNoYW5nZVdhdGNoZWRGaWxlcyhmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBmaWxlUGF0aC5lbmRzV2l0aCgnLmdyYWRsZScpIHx8IGZpbGVQYXRoLmVuZHNXaXRoKHBhdGguam9pbignJywgJ3BvbS54bWwnKSk7XG4gICAgfVxuXG4gICAgZ2V0SmF2YU9wdGlvbnMoKTogSmF2YU9wdGlvbnMge1xuICAgICAgICBjb25zdCBob21lID0gYXRvbS5jb25maWcuZ2V0KCdzcHJpbmctYm9vdC5qYXZhLmhvbWUnKTtcbiAgICAgICAgY29uc3Qgdm1hcmdzID0gYXRvbS5jb25maWcuZ2V0KCdzcHJpbmctYm9vdC5qYXZhLnZtYXJncycpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaG9tZTogdHlwZW9mIGhvbWUgPT09ICdzdHJpbmcnID8gaG9tZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHZtYXJnczogQXJyYXkuaXNBcnJheSh2bWFyZ3MpID8gdm1hcmdzIDogIHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgIH1cblxufVxuIl19