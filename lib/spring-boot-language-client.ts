import * as path from 'path';
import {JavaProcessLanguageClient, JavaOptions} from '@pivotal-tools/atom-languageclient-commons';
import {BootStsAdapter} from './boot-sts-adapter';
import {ActiveServer} from 'atom-languageclient';
import {JVM} from '@pivotal-tools/jvm-launch-utils';

export class SpringBootLanguageClient extends JavaProcessLanguageClient {

    constructor() {
        //noinspection JSAnnotator
        const overrideJar = atom.config.get('spring-boot.serverJar');
        if (typeof overrideJar === 'string' && overrideJar.length > 0) {
            super(path.dirname(overrideJar), path.basename(overrideJar));
        } else {
            super(
                path.join(__dirname, '..', 'server'),
                'spring-boot-language-server.jar'
            );
        }
        // this.DEBUG = true;
    }

    protected postInitialization(server: ActiveServer) {
        super.postInitialization(server);
        this.sendConfig(server);
        (<any>this)._disposable.add(atom.config.observe('spring-boot', () => this.sendConfig(server)));
    }

    private sendConfig(server: ActiveServer) {
        server.connection.didChangeConfiguration({ settings: {'boot-java': atom.config.get('spring-boot') }});
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

    launchVmArgs(jvm: JVM) {
        let vmargs = [
            // '-Xdebug',
            // '-agentlib:jdwp=transport=dt_socket,server=y,address=7999,suspend=y',
            '-Dorg.slf4j.simpleLogger.logFile=boot-java.log'
        ];
        if (!jvm.isJdk()) {
            this.showErrorMessage(
                'Spring Boot Language Support Limited',
                'JAVA_HOME or PATH points to a JRE. The Spring Boot Language Server needs a JDK (Java 17 or newer); Boot live hints are unavailable until one is configured.'
            );
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
        return new BootStsAdapter();
    }

    filterChangeWatchedFiles(filePath: string) {
        return filePath.endsWith('.gradle') || filePath.endsWith(path.join('', 'pom.xml'));
    }

    getJavaOptions(): JavaOptions {
        const home = atom.config.get('spring-boot.java.home');
        const vmargs = atom.config.get('spring-boot.java.vmargs');
        return {
            home: typeof home === 'string' ? home : undefined,
            vmargs: Array.isArray(vmargs) ? vmargs :  undefined
        };
    }

}
