declare global {
    const Translator: {
        trans(key: string, properties: object, domain: string);
    };
    interface Window {
        eZ: any;
        Routing: {
            generate(routing: string, params: object);
        };
    }
}

export {};
