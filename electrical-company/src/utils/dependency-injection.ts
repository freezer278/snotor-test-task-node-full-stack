import "reflect-metadata";

import {container} from "tsyringe";

// here we can add some custom container bindings like this:
// container.register<Foo>(Foo, {useClass: Foo});
// container.register<Bar>(Bar, {useValue: new Bar()});

export {container};