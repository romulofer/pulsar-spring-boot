# pulsar-spring-boot

Pulsar package and Language Server providing support for working with Spring Boot apps. This is a migration of the archived `spring-projects/atom-spring-boot` package (VMware/Pivotal, EPL-1.0), adapted to run on the Pulsar editor.

## Requirements

Install these companion packages (they are pulled in automatically via `package-deps` on first activation):

- [`atom-ide-base`](https://web.pulsar-edit.dev/packages/atom-ide-base), the Pulsar replacement for the archived `atom-ide-ui`, surfaces the IDE UI.
- `ide-java-pulsar`, the Pulsar replacement for the archived `ide-java`, provides general Java language support.

A JDK (Java 17 or newer) must be on `JAVA_HOME` or `PATH`; Spring Boot live hints require a JDK, not a JRE.

## Installation

Install from Pulsar's package view (search for `pulsar-spring-boot`), or from the command line:

    ppm install pulsar-spring-boot

# Java Support

## Usage:

The extension will automatically activate when you edit files with the following
name patterns:

 - `*.java` => activates support for Java files
 
If you find an issue please raise it here: https://github.com/spring-projects/sts4/issues

## Functionality

### Navigating the source code - Go to symbol in file
Easy navigation to Spring-specific elements of your source code. Open `.java` file then open Pulsar's `Outline View` - View -> Toggle Outline View

![Go to Symbol in file][screenshot-navigation]

### Live application information hovers
Show information from running Spring Boot apps on your machine in the source code. This allows you to run the Spring Boot app locally on your machine and visualizes information from those running apps in your source code.

#### Visualization
Once the tooling detects a running Spring Boot app on your local machine, it automatically shows hints in the source code where data from the running app can be inspected. Then hovering over that area (with the mouse pointer), the data from the running app shows up.

If there are multiple instances of the app running on your machine, the live data from all those instances will show up in the hover information.

![live data from running apps as hover on source code][screenshot-live-hovers]

#### Examples
* `@Profile`: shows information about the active profiles on the running apps
* `@Component`, `@Bean`, `@Autowired`: shows detailed information about the beans and their wiring from the live app
* `@ContidionalOn...`: shows information about the conditions and their evaluation at runtime
* `RequestMapping`: show information about the request mapping for running apps

#### Configuration
You can enable/disable this feature via workspace preferences by adding the following:
```
  "boot-java":
    "boot-hints":
      on: false

```

### Smart code completions
Additional code completions for Spring-specific annotations

![Smart code completion for boot properties][screenshot-code-completion]

#### Examples
* `@Value`: code completion for Spring Boot property keys
* `@Scope`: code completion for standard scope names

# Properties Support

Pulsar package and Language Server providing support for working with Spring Boot 
`application.properties` and `application.yml` files.

## Usage:

The package will automatically activate when you edit files with the following
name patterns:

 - `application.properties` => activates support for Spring Boot properties in `.properties`format.
 - `application.yml` =>  activates support for Spring Boot properties in `.yml` format.

For all other files select grammar to be `Spring-Boot-Properties` for `properties` file format or `Spring-Boot-Properties-YAML` for 'YAML' file format

## Functionality

This package analyzes your project's classpath and parses and indexes any [Spring Boot
Properties Metadata](https://docs.spring.io/spring-boot/docs/current/reference/html/configuration-metadata.html) it finds. Both Maven and Gradle projects are supported.

The data in the index is used to provide validation, code completions and information
hovers while editing Spring Boot Properties in either `.properties` or `.yml` format.

### Validation

Property keys as well as property values are validated. Property keys are validated for being known properties and values are checked for being of expected type as well being a valid value

![application-yaml-validation][yaml-validation]
![application-properties-validation][properties-validation]

### Code Completions

Both YAML and Properties formats have support for Content Assist on property keys and values helping to write valid Spring Boot configuration files right from the start.

![application-yaml-completions][yaml-completion]

![application-properties-completions][properties-completion]

### Information Hovers

Hovering over property keys provide valuable documentation about the purpose of the property and expected type for its value in a small popup window.

![application-yaml-hovers][yaml-hovers]

# Issues and Feature Requests

Please report bugs, issues and feature requests on the [Github STS4 issue tracker](https://github.com/spring-projects/sts4/issues). 


# Releases:

Released versions of this package can be installed directly from the Pulsar package view.

There are also development snapshots available with the latest fixes and improvements from the release git repository: https://github.com/romulofer/pulsar-spring-boot 
1. Clone the release repository if not already cloned and navigate to the `pulsar-spring-boot` folder
2. Run `git clean -fxd` - necessary to delete out of date LS JAR file and dependency packages
3. Run `git pull` - get the latest changes
3. Run `npm install` - Install latest dependencies and download proper LS JAR
4. Run `ppm link .` - Link the package to Pulsar
5. Either start Pulsar or Reload Window in Pulsar 

[screenshot-live-hovers]: https://raw.githubusercontent.com/spring-projects/sts4/4167094ab94a05657fe4b495770bf93ce3a1585f/atom-extensions/atom-spring-boot/readme-imgs/screenshot-live-hovers.png
[screenshot-code-completion]: https://raw.githubusercontent.com/spring-projects/sts4/874c74f3bae0dd08250aeceb46ae5cc2ca720096/atom-extensions/atom-spring-boot/readme-imgs/screenshot-code-completion.png
[screenshot-navigation]: https://raw.githubusercontent.com/spring-projects/sts4/4167094ab94a05657fe4b495770bf93ce3a1585f/atom-extensions/atom-spring-boot/readme-imgs/screenshot-navigation-in-file.png

[yaml-completion]: https://raw.githubusercontent.com/spring-projects/sts4/874c74f3bae0dd08250aeceb46ae5cc2ca720096/atom-extensions/atom-spring-boot/readme-imgs/yaml-completion.png
[properties-completion]: https://raw.githubusercontent.com/spring-projects/sts4/874c74f3bae0dd08250aeceb46ae5cc2ca720096/atom-extensions/atom-spring-boot/readme-imgs/properties-completion.png
[yaml-validation]: https://raw.githubusercontent.com/spring-projects/sts4/874c74f3bae0dd08250aeceb46ae5cc2ca720096/atom-extensions/atom-spring-boot/readme-imgs/yaml-validation.png
[properties-validation]: https://raw.githubusercontent.com/spring-projects/sts4/874c74f3bae0dd08250aeceb46ae5cc2ca720096/atom-extensions/atom-spring-boot/readme-imgs/properties-validation.png
[yaml-hovers]: https://raw.githubusercontent.com/spring-projects/sts4/874c74f3bae0dd08250aeceb46ae5cc2ca720096/atom-extensions/atom-spring-boot/readme-imgs/yaml-hovers.png
