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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ByaW5nLWJvb3QtbGFuZ3VhZ2UtY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3NwcmluZy1ib290LWxhbmd1YWdlLWNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qiw0RkFBa0c7QUFDbEcseURBQWtEO0FBSWxELDhCQUFzQyxTQUFRLHVEQUF5QjtJQUVuRTtRQUNJLDBCQUEwQjtRQUMxQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzdELElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztTQUNoRTthQUFNO1lBQ0gsS0FBSyxDQUNELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsRUFDcEMsaUNBQWlDLENBQ3BDLENBQUM7U0FDTDtRQUNELHFCQUFxQjtJQUN6QixDQUFDO0lBRVMsa0JBQWtCLENBQUMsTUFBb0I7UUFDN0MsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEIsSUFBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFTyxVQUFVLENBQUMsTUFBb0I7UUFDbkMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztJQUMxRyxDQUFDO0lBRUQsZ0JBQWdCO1FBQ1osT0FBTyxDQUFDLGFBQWEsRUFBRSx3QkFBd0IsRUFBRSw2QkFBNkIsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsZUFBZTtRQUNYLE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxhQUFhO1FBQ1QsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsbUJBQW1CLENBQUM7YUFDdkIsT0FBTyxDQUFDLG9CQUFvQixDQUFDO2FBQzdCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQztRQUN6RSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsWUFBWSxDQUFDLEdBQVE7UUFDakIsSUFBSSxNQUFNLEdBQUc7WUFDVCxhQUFhO1lBQ2Isd0VBQXdFO1lBQ3hFLGdEQUFnRDtTQUNuRCxDQUFDO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNkLElBQUksQ0FBQyxnQkFBZ0IsQ0FDakIsc0NBQXNDLEVBQ3RDLDZKQUE2SixDQUNoSyxDQUFDO1NBQ0w7UUFDRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELGdCQUFnQjtRQUNaLE9BQU8sSUFBSSxpQ0FBYyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELHdCQUF3QixDQUFDLFFBQWdCO1FBQ3JDLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVELGNBQWM7UUFDVixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDMUQsT0FBTztZQUNILElBQUksRUFBRSxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUztZQUNqRCxNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBRSxTQUFTO1NBQ3RELENBQUM7SUFDTixDQUFDO0NBRUo7QUFqRkQsNERBaUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7SmF2YVByb2Nlc3NMYW5ndWFnZUNsaWVudCwgSmF2YU9wdGlvbnN9IGZyb20gJ0BwaXZvdGFsLXRvb2xzL2F0b20tbGFuZ3VhZ2VjbGllbnQtY29tbW9ucyc7XG5pbXBvcnQge0Jvb3RTdHNBZGFwdGVyfSBmcm9tICcuL2Jvb3Qtc3RzLWFkYXB0ZXInO1xuaW1wb3J0IHtBY3RpdmVTZXJ2ZXJ9IGZyb20gJ2F0b20tbGFuZ3VhZ2VjbGllbnQnO1xuaW1wb3J0IHtKVk19IGZyb20gJ0BwaXZvdGFsLXRvb2xzL2p2bS1sYXVuY2gtdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgU3ByaW5nQm9vdExhbmd1YWdlQ2xpZW50IGV4dGVuZHMgSmF2YVByb2Nlc3NMYW5ndWFnZUNsaWVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNBbm5vdGF0b3JcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGVKYXIgPSBhdG9tLmNvbmZpZy5nZXQoJ3NwcmluZy1ib290LnNlcnZlckphcicpO1xuICAgICAgICBpZiAodHlwZW9mIG92ZXJyaWRlSmFyID09PSAnc3RyaW5nJyAmJiBvdmVycmlkZUphci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzdXBlcihwYXRoLmRpcm5hbWUob3ZlcnJpZGVKYXIpLCBwYXRoLmJhc2VuYW1lKG92ZXJyaWRlSmFyKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlcihcbiAgICAgICAgICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnc2VydmVyJyksXG4gICAgICAgICAgICAgICAgJ3NwcmluZy1ib290LWxhbmd1YWdlLXNlcnZlci5qYXInXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMuREVCVUcgPSB0cnVlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwb3N0SW5pdGlhbGl6YXRpb24oc2VydmVyOiBBY3RpdmVTZXJ2ZXIpIHtcbiAgICAgICAgc3VwZXIucG9zdEluaXRpYWxpemF0aW9uKHNlcnZlcik7XG4gICAgICAgIHRoaXMuc2VuZENvbmZpZyhzZXJ2ZXIpO1xuICAgICAgICAoPGFueT50aGlzKS5fZGlzcG9zYWJsZS5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnc3ByaW5nLWJvb3QnLCAoKSA9PiB0aGlzLnNlbmRDb25maWcoc2VydmVyKSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2VuZENvbmZpZyhzZXJ2ZXI6IEFjdGl2ZVNlcnZlcikge1xuICAgICAgICBzZXJ2ZXIuY29ubmVjdGlvbi5kaWRDaGFuZ2VDb25maWd1cmF0aW9uKHsgc2V0dGluZ3M6IHsnYm9vdC1qYXZhJzogYXRvbS5jb25maWcuZ2V0KCdzcHJpbmctYm9vdCcpIH19KTtcbiAgICB9XG5cbiAgICBnZXRHcmFtbWFyU2NvcGVzKCkge1xuICAgICAgICByZXR1cm4gWydzb3VyY2UuamF2YScsICdzb3VyY2UuYm9vdC1wcm9wZXJ0aWVzJywgJ3NvdXJjZS5ib290LXByb3BlcnRpZXMteWFtbCcsICd0ZXh0LnhtbCddO1xuICAgIH1cblxuICAgIGdldExhbmd1YWdlTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdzcHJpbmctYm9vdCc7XG4gICAgfVxuXG4gICAgZ2V0U2VydmVyTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdTcHJpbmcgQm9vdCc7XG4gICAgfVxuXG4gICAgYWN0aXZhdGUoKSB7XG4gICAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJylcbiAgICAgICAgICAgIC5pbnN0YWxsKCdwdWxzYXItc3ByaW5nLWJvb3QnKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gY29uc29sZS5kZWJ1ZygnQWxsIGRlcGVuZGVuY2llcyBpbnN0YWxsZWQsIGdvb2QgdG8gZ28nKSk7XG4gICAgICAgIHN1cGVyLmFjdGl2YXRlKCk7XG4gICAgfVxuXG4gICAgcHJlZmVySmRrKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBsYXVuY2hWbUFyZ3MoanZtOiBKVk0pIHtcbiAgICAgICAgbGV0IHZtYXJncyA9IFtcbiAgICAgICAgICAgIC8vICctWGRlYnVnJyxcbiAgICAgICAgICAgIC8vICctYWdlbnRsaWI6amR3cD10cmFuc3BvcnQ9ZHRfc29ja2V0LHNlcnZlcj15LGFkZHJlc3M9Nzk5OSxzdXNwZW5kPXknLFxuICAgICAgICAgICAgJy1Eb3JnLnNsZjRqLnNpbXBsZUxvZ2dlci5sb2dGaWxlPWJvb3QtamF2YS5sb2cnXG4gICAgICAgIF07XG4gICAgICAgIGlmICghanZtLmlzSmRrKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yTWVzc2FnZShcbiAgICAgICAgICAgICAgICAnU3ByaW5nIEJvb3QgTGFuZ3VhZ2UgU3VwcG9ydCBMaW1pdGVkJyxcbiAgICAgICAgICAgICAgICAnSkFWQV9IT01FIG9yIFBBVEggcG9pbnRzIHRvIGEgSlJFLiBUaGUgU3ByaW5nIEJvb3QgTGFuZ3VhZ2UgU2VydmVyIG5lZWRzIGEgSkRLIChKYXZhIDE3IG9yIG5ld2VyKTsgQm9vdCBsaXZlIGhpbnRzIGFyZSB1bmF2YWlsYWJsZSB1bnRpbCBvbmUgaXMgY29uZmlndXJlZC4nXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodm1hcmdzKTtcbiAgICB9XG5cbiAgICBjcmVhdGVTdHNBZGFwdGVyKCkge1xuICAgICAgICByZXR1cm4gbmV3IEJvb3RTdHNBZGFwdGVyKCk7XG4gICAgfVxuXG4gICAgZmlsdGVyQ2hhbmdlV2F0Y2hlZEZpbGVzKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZpbGVQYXRoLmVuZHNXaXRoKCcuZ3JhZGxlJykgfHwgZmlsZVBhdGguZW5kc1dpdGgocGF0aC5qb2luKCcnLCAncG9tLnhtbCcpKTtcbiAgICB9XG5cbiAgICBnZXRKYXZhT3B0aW9ucygpOiBKYXZhT3B0aW9ucyB7XG4gICAgICAgIGNvbnN0IGhvbWUgPSBhdG9tLmNvbmZpZy5nZXQoJ3NwcmluZy1ib290LmphdmEuaG9tZScpO1xuICAgICAgICBjb25zdCB2bWFyZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ3NwcmluZy1ib290LmphdmEudm1hcmdzJyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBob21lOiB0eXBlb2YgaG9tZSA9PT0gJ3N0cmluZycgPyBob21lIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdm1hcmdzOiBBcnJheS5pc0FycmF5KHZtYXJncykgPyB2bWFyZ3MgOiAgdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgfVxuXG59XG4iXX0=