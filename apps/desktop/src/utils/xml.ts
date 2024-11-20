type XMLParserSupportedType = 'text/xml' | 'application/xml';

export function create(namespace?: string, qualifiedName?: string, withDeclaration: boolean = false): XMLDocument {
    // Create a new XML document
    const doc = document.implementation.createDocument(namespace, qualifiedName, null);

    if (withDeclaration) {
        // Create the XML declaration
        const declaration = doc.createProcessingInstruction(
            'xml',
            'version="1.0" encoding="UTF-8"',
        );

        // Add the XML declaration to the document
        doc.insertBefore(declaration, doc.firstChild);
    }

    return doc;
}

export function parse(value: string, type: XMLParserSupportedType = 'text/xml'): XMLDocument {
    const parser = new DOMParser();
    return parser.parseFromString(value, type);
}

export function stringify(doc: XMLDocument): string {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
}