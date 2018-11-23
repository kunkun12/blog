module.exports = function ({types:t}) {
    return {
        visitor:{
            ImportDeclaration(path) {
                const specifiers = path.node.specifiers;
                const source = path.node.source;
                if("lodash" == source.value && (!t.isImportDefaultSpecifier(specifiers[0]))) { 
                    var declarations = specifiers.map((specifier) => {     
                        return t.ImportDeclaration(                        
                            [t.importDefaultSpecifier(specifier.local)],
                            t.StringLiteral(`${source.value}/${specifier.local.name}`)
                        )
                    })
                    path.replaceWithMultiple(declarations)
                }
            }
        }
    };
}